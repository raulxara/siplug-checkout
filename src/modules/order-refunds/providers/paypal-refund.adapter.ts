import { Injectable } from '@nestjs/common';
import { PaymentRefund } from '@prisma/client';
import { RefundHttpService } from './refund-http.service';
import {
  RefundAdapter,
  RefundPayment,
  RefundSubscription,
  object,
  safeId,
  cents,
  match,
  RefundResult,
} from './refund-contract';
@Injectable()
export class PaypalRefundAdapter implements RefundAdapter {
  constructor(private readonly http: RefundHttpService) {}
  private parts(id: string) {
    const [kind, value] = id.split(':');
    if (!['sale', 'capture'].includes(kind))
      throw new Error('REFUND_PAYMENT_ID_INVALID');
    return { kind, value: safeId(value, /^[a-zA-Z0-9]+$/) };
  }
  async verify(p: RefundPayment, pinned?: string) {
    const { base, headers } = await this.http.paypal(p.api_credential!);
    let id = pinned;
    const latest = object(object(p.provider_response).latestWebhookPayload);
    if (!id && latest.event_type === 'PAYMENT.SALE.COMPLETED')
      id = 'sale:' + safeId(latest.resource?.id, /^[a-zA-Z0-9]+$/);
    if (!id && latest.event_type === 'PAYMENT.CAPTURE.COMPLETED')
      id = 'capture:' + safeId(latest.resource?.id, /^[a-zA-Z0-9]+$/);
    if (!id) {
      const order = await this.http.json(
        base +
          '/v2/checkout/orders/' +
          safeId(p.gateway_transaction_id, /^[a-zA-Z0-9]+$/),
        'GET',
        headers,
      );
      const units = order.purchase_units ?? [];
      const captures = units.flatMap((u: any) => u.payments?.captures ?? []);
      if (captures.length !== 1) throw new Error('REFUND_PAYMENT_AMBIGUOUS');
      id = 'capture:' + safeId(captures[0].id, /^[a-zA-Z0-9]+$/);
    }
    const { kind, value } = this.parts(id);
    const payment = await this.http.json(
      base +
        (kind === 'sale' ? '/v1/payments/sale/' : '/v2/payments/captures/') +
        value,
      'GET',
      headers,
    );
    if (payment.id !== value) throw new Error('REFUND_PAYMENT_MISMATCH');
    match(
      p,
      cents(kind === 'sale' ? payment.amount?.total : payment.amount?.value),
      kind === 'sale'
        ? payment.amount?.currency
        : payment.amount?.currency_code,
    );
    const ref = payment.custom ?? payment.custom_id;
    if (ref && ![p.unique_id, p.external_reference].includes(ref))
      throw new Error('REFUND_PAYMENT_MISMATCH');
    if (
      kind === 'sale' &&
      payment.billing_agreement_id !== p.gateway_transaction_id
    )
      throw new Error('REFUND_PAYMENT_MISMATCH');
    const status = kind === 'sale' ? payment.state : payment.status;
    // Without a reliable provider refunded total, never guess the remaining balance.
    if (!['completed', 'COMPLETED', 'refunded', 'REFUNDED'].includes(status))
      throw new Error('REFUND_PAYMENT_REVIEW');
    return {
      id,
      refunded: ['refunded', 'REFUNDED'].includes(status) ? p.amount : 0,
    };
  }
  async submit(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
  ): Promise<RefundResult> {
    const { kind, value } = this.parts(id),
      { base, headers } = await this.http.paypal(p.api_credential!);
    const amount =
      kind === 'sale'
        ? { total: (r.amount / 100).toFixed(2), currency: p.currency }
        : { value: (r.amount / 100).toFixed(2), currency_code: p.currency };
    const result = await this.http.json(
      base +
        (kind === 'sale' ? '/v1/payments/sale/' : '/v2/payments/captures/') +
        value +
        '/refund',
      'POST',
      { ...headers, 'PayPal-Request-Id': r.unique_id },
      { amount },
    );
    return this.result(p, id, r, result);
  }
  private result(
    p: RefundPayment,
    id: string,
    r: PaymentRefund,
    result: Record<string, any>,
  ): RefundResult {
    const { kind, value } = this.parts(id);
    const money = result.amount;
    const n = cents(kind === 'sale' ? money?.total : money?.value),
      currency = kind === 'sale' ? money?.currency : money?.currency_code;
    if (n !== r.amount || currency !== p.currency || !result.id)
      throw new Error('REFUND_RESPONSE_INVALID');
    if (kind === 'sale' && result.sale_id !== value)
      throw new Error('REFUND_RESPONSE_INVALID');
    if (kind === 'capture') {
      const link = (result.links ?? []).find((l: any) => l.rel === 'up');
      if (
        !link ||
        new URL(link.href).pathname !== '/v2/payments/captures/' + value
      )
        throw new Error('REFUND_RESPONSE_INVALID');
    }
    const state = String(result.status ?? result.state).toUpperCase();
    return {
      id: safeId(result.id, /^[a-zA-Z0-9]+$/),
      state:
        state === 'COMPLETED'
          ? 'succeeded'
          : ['FAILED', 'CANCELLED', 'CANCELED'].includes(state)
            ? 'failed'
            : 'processing',
    };
  }
  async poll(p: RefundPayment, id: string, r: PaymentRefund) {
    if (!r.gateway_refund_id) return null; // Lost POST response requires reconciliation; never issue a second refund.
    const { kind } = this.parts(id),
      { base, headers } = await this.http.paypal(p.api_credential!);
    const result = await this.http.json(
      base +
        (kind === 'sale' ? '/v1/payments/refund/' : '/v2/payments/refunds/') +
        safeId(r.gateway_refund_id, /^[a-zA-Z0-9]+$/),
      'GET',
      headers,
    );
    if (result.id !== r.gateway_refund_id)
      throw new Error('REFUND_RESPONSE_INVALID');
    return this.result(p, id, r, result);
  }
  async cancel(s: RefundSubscription) {
    const { base, headers } = await this.http.paypal(s.api_credential!);
    const path =
      '/v1/billing/subscriptions/' +
      safeId(s.gateway_subscription_id, /^I-[a-zA-Z0-9]+$/);
    let current = await this.http.json(base + path, 'GET', headers);
    if (current.id !== s.gateway_subscription_id)
      throw new Error('SUBSCRIPTION_MISMATCH');
    if (current.status !== 'CANCELLED') {
      await this.http.json(base + path + '/cancel', 'POST', headers, {
        reason: 'Cancelamento solicitado pelo vendedor.',
      });
      current = await this.http.json(base + path, 'GET', headers);
    }
    if (
      current.id !== s.gateway_subscription_id ||
      current.status !== 'CANCELLED'
    )
      throw new Error('SUBSCRIPTION_CANCEL_UNCONFIRMED');
  }
}
