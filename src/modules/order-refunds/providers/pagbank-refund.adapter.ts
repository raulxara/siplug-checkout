import { pagbankRefundBody } from '../refund-request-body';
import { Injectable } from '@nestjs/common';
import { PaymentRefund } from '@prisma/client';
import { RefundHttpService } from './refund-http.service';
import {
  RefundAdapter,
  RefundPayment,
  object,
  safeId,
  match,
  RefundResult,
} from './refund-contract';
@Injectable()
export class PagbankRefundAdapter implements RefundAdapter {
  constructor(private readonly http: RefundHttpService) {}
  private base(p: RefundPayment) {
    return this.http.environment(p.api_credential!) === 'sandbox'
      ? 'https://sandbox.api.pagseguro.com'
      : 'https://api.pagseguro.com';
  }
  private async charge(p: RefundPayment, id: string) {
    return this.http.json(
      this.base(p) + '/charges/' + safeId(id, /^CHAR_[a-zA-Z0-9-]+$/),
      'GET',
      this.http.bearer(p.api_credential!),
    );
  }
  async verify(p: RefundPayment, pinned?: string) {
    let id = pinned;
    if (!id) {
      const latest = object(object(p.gateway_response).latestWebhook);
      id = latest.gatewayChargeId;
      if (!id && p.gateway_transaction_id?.startsWith('CHAR_'))
        id = p.gateway_transaction_id;
      if (!id) {
        const checkout = await this.http.json(
          this.base(p) +
            '/checkouts/' +
            safeId(p.gateway_transaction_id, /^CHEC_[a-zA-Z0-9-]+$/),
          'GET',
          this.http.bearer(p.api_credential!),
        );
        if (checkout.reference_id !== p.external_reference)
          throw new Error('REFUND_PAYMENT_MISMATCH');
        const orders = Array.isArray(checkout.orders) ? checkout.orders : [];
        const candidates: string[] = [];
        for (const o of orders.slice(0, 10)) {
          const order = await this.http.json(
            this.base(p) + '/orders/' + safeId(o.id, /^ORDE_[a-zA-Z0-9-]+$/),
            'GET',
            this.http.bearer(p.api_credential!),
          );
          if (order.reference_id !== p.external_reference)
            throw new Error('REFUND_PAYMENT_MISMATCH');
          for (const c of order.charges ?? [])
            if (c.status === 'PAID' && c.amount?.value === p.amount)
              candidates.push(c.id);
        }
        if (candidates.length !== 1)
          throw new Error('REFUND_PAYMENT_AMBIGUOUS');
        id = candidates[0];
      }
    }
    const c = await this.charge(p, id!);
    match(p, c.amount?.value, c.amount?.currency);
    if (
      c.id !== id ||
      !p.external_reference ||
      c.reference_id !== p.external_reference ||
      !['PAID', 'CANCELED'].includes(c.status)
    )
      throw new Error('REFUND_PAYMENT_MISMATCH');
    const refunded = c.amount?.summary?.refunded;
    if (!Number.isSafeInteger(refunded) || refunded < 0 || refunded > p.amount)
      throw new Error('REFUND_AMOUNT_INVALID');
    return { id: id!, refunded };
  }
  async submit(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
  ): Promise<RefundResult> {
    const c = await this.http.json(
      this.base(p) +
        '/charges/' +
        safeId(id, /^CHAR_[a-zA-Z0-9-]+$/) +
        '/cancel',
      'POST',
      {
        ...this.http.bearer(p.api_credential!),
        'x-idempotency-key': r.unique_id,
      },
      pagbankRefundBody(r.amount),
    );
    return this.result(p, id, r, c);
  }
  private result(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
    c: Record<string, any>,
  ): RefundResult {
    match(p, c.amount?.value, c.amount?.currency);
    if (c.id !== id || c.reference_id !== p.external_reference)
      throw new Error('REFUND_RESPONSE_INVALID');
    const before = Number(object(r.metadata).providerRefundedBefore ?? 0),
      total = c.amount?.summary?.refunded;
    if (
      !Number.isSafeInteger(total) ||
      total < before ||
      total > before + r.amount
    )
      throw new Error('REFUND_RECONCILIATION_MISMATCH');
    return {
      id,
      state: total === before + r.amount ? 'succeeded' : 'processing',
    };
  }
  async poll(p: RefundPayment, id: string, r: PaymentRefund) {
    const result = this.result(p, id, r, await this.charge(p, id));
    // A failed/uncertain POST is not acknowledged by an unchanged charge.
    if (result.state === 'processing' && !r.gateway_refund_id) return null;
    return result;
  }
}
