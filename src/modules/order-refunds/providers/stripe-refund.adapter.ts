import { Injectable } from '@nestjs/common';
import { PaymentRefund } from '@prisma/client';
import { RefundHttpService } from './refund-http.service';
import {
  RefundAdapter,
  RefundPayment,
  RefundSubscription,
  object,
  safeId,
  match,
  RefundResult,
} from './refund-contract';
@Injectable()
export class StripeRefundAdapter implements RefundAdapter {
  constructor(private readonly http: RefundHttpService) {}
  private get(p: RefundPayment | RefundSubscription, path: string) {
    return this.http.json(
      'https://api.stripe.com/v1/' + path,
      'GET',
      this.http.bearer(p.api_credential!),
    );
  }
  async verify(p: RefundPayment, pinned?: string) {
    let id = pinned ?? p.gateway_transaction_id;
    if (id?.startsWith('cs_')) {
      const session = await this.get(
        p,
        'checkout/sessions/' + safeId(id, /^cs_[a-zA-Z0-9_]+$/),
      );
      if (
        session.client_reference_id &&
        ![p.unique_id, p.external_reference].includes(
          session.client_reference_id,
        )
      )
        throw new Error('REFUND_PAYMENT_MISMATCH');
      id = session.payment_intent;
      if (!id && session.invoice) {
        const inv = await this.get(
          p,
          'invoices/' + safeId(session.invoice, /^in_[a-zA-Z0-9]+$/),
        );
        id = inv.payment_intent ?? inv.charge;
      }
    }
    if (id?.startsWith('pi_')) {
      const intent = await this.get(
        p,
        'payment_intents/' + safeId(id, /^pi_[a-zA-Z0-9]+$/),
      );
      id = intent.latest_charge;
    }
    if (!id?.startsWith('ch_'))
      id = object(object(p.gateway_response).latestWebhook).gatewayChargeId;
    id = safeId(id, /^ch_[a-zA-Z0-9]+$/);
    const c = await this.get(p, 'charges/' + id);
    match(p, c.amount, c.currency);
    if (
      c.id !== id ||
      !c.paid ||
      !c.captured ||
      c.disputed ||
      c.livemode !== (this.http.environment(p.api_credential!) === 'production')
    )
      throw new Error('REFUND_PAYMENT_MISMATCH');
    if (
      !Number.isSafeInteger(c.amount_refunded) ||
      c.amount_refunded < 0 ||
      c.amount_refunded > p.amount
    )
      throw new Error('REFUND_AMOUNT_INVALID');
    return { id, refunded: c.amount_refunded };
  }
  async submit(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
  ): Promise<RefundResult> {
    const body = new URLSearchParams({
      charge: safeId(id, /^ch_[a-zA-Z0-9]+$/),
      amount: String(r.amount),
      'metadata[siplugRefundId]': r.unique_id,
    });
    return this.result(
      p,
      id,
      r,
      await this.http.json(
        'https://api.stripe.com/v1/refunds',
        'POST',
        {
          ...this.http.bearer(p.api_credential!),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': r.unique_id,
        },
        body.toString(),
      ),
    );
  }
  private result(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
    v: Record<string, any>,
  ): RefundResult {
    if (
      v.charge !== id ||
      v.amount !== r.amount ||
      v.currency?.toUpperCase() !== p.currency ||
      v.metadata?.siplugRefundId !== r.unique_id
    )
      throw new Error('REFUND_RESPONSE_INVALID');
    return {
      id: safeId(v.id, /^re_[a-zA-Z0-9]+$/),
      state:
        v.status === 'succeeded'
          ? 'succeeded'
          : ['failed', 'canceled'].includes(v.status)
            ? 'failed'
            : 'processing',
    };
  }
  async poll(p: RefundPayment, id: string, r: PaymentRefund) {
    if (r.gateway_refund_id)
      return this.result(
        p,
        id,
        r,
        await this.get(
          p,
          'refunds/' + safeId(r.gateway_refund_id, /^re_[a-zA-Z0-9]+$/),
        ),
      );
    const refunds = await this.get(
      p,
      'refunds?charge=' + safeId(id, /^ch_[a-zA-Z0-9]+$/) + '&limit=100',
    );
    const rows = (refunds.data ?? []).filter(
      (v: any) => v.metadata?.siplugRefundId === r.unique_id,
    );
    if (rows.length !== 1) return null;
    return this.result(p, id, r, rows[0]);
  }
  async cancel(s: RefundSubscription) {
    const path =
      'subscriptions/' +
      safeId(s.gateway_subscription_id, /^sub_[a-zA-Z0-9]+$/);
    let v = await this.get(s, path);
    if (
      v.id !== s.gateway_subscription_id ||
      v.livemode !== (this.http.environment(s.api_credential!) === 'production')
    )
      throw new Error('SUBSCRIPTION_MISMATCH');
    if (v.status !== 'canceled')
      v = await this.http.json(
        'https://api.stripe.com/v1/' +
          path +
          '?invoice_now=false&prorate=false',
        'DELETE',
        this.http.bearer(s.api_credential!),
      );
    if (v.id !== s.gateway_subscription_id || v.status !== 'canceled')
      throw new Error('SUBSCRIPTION_CANCEL_UNCONFIRMED');
  }
}
