import { Injectable, ConflictException } from '@nestjs/common';
import { OrderRefundsRepository } from './order-refunds.repository';
import { OrderRefundDto } from './order-refunds.dto';
import { PagbankRefundAdapter } from './providers/pagbank-refund.adapter';
import { PaypalRefundAdapter } from './providers/paypal-refund.adapter';
import { StripeRefundAdapter } from './providers/stripe-refund.adapter';
import {
  RefundAdapter,
  RefundPayment,
  RefundSubscription,
  object,
} from './providers/refund-contract';
import { RefundGatewayException } from './mercado-pago-refund.service';
@Injectable()
export class MultiGatewayRefundService {
  constructor(
    private readonly repo: OrderRefundsRepository,
    private readonly pagbank: PagbankRefundAdapter,
    private readonly paypal: PaypalRefundAdapter,
    private readonly stripe: StripeRefundAdapter,
  ) {}
  private adapter(provider: string): RefundAdapter {
    switch (provider.trim().toLowerCase()) {
      case 'pagseguro':
      case 'pagbank':
        return this.pagbank;
      case 'paypal':
        return this.paypal;
      case 'stripe':
        return this.stripe;
      default:
        throw new ConflictException('REFUND_PROVIDER_UNAVAILABLE');
    }
  }
  async cancel(s: RefundSubscription) {
    const adapter = this.adapter(s.api_credential!.provider);
    if (!adapter.cancel) throw new ConflictException('SUBSCRIPTION_REVIEW');
    await adapter.cancel(s);
  }
  async exec(
    office: string,
    client: string,
    p: RefundPayment,
    d: OrderRefundDto,
  ) {
    const config = object(p.config),
      credentialConfig = object(p.api_credential!.config);
    const environment =
      credentialConfig.environment ?? p.api_credential!.environment;
    if (config.environment && config.environment !== environment)
      throw new ConflictException('REFUND_ENVIRONMENT_MISMATCH');
    const adapter = this.adapter(p.api_credential!.provider);
    let r = await this.repo.findRefund(d.requestId);
    if (
      r &&
      (r.office_id !== office ||
        r.client_id !== client ||
        r.payment_transaction_id !== p.unique_id ||
        r.amount !== d.amount)
    )
      throw new ConflictException('REFUND_KEY_REUSED');
    if (r && ['succeeded', 'failed'].includes(r.status)) {
      if (r.status === 'succeeded')
        await this.repo.projectConfirmed(office, client, p.unique_id);
      return { id: r.unique_id, state: r.status, amount: r.amount };
    }
    if (!r) {
      const remote = await adapter.verify(p);
      r = await this.repo.reserve(
        office,
        client,
        d,
        remote.refunded,
        remote.id,
      );
    }
    const id = object(r.metadata).gatewayPaymentId;
    if (typeof id !== 'string' || !id)
      throw new ConflictException('REFUND_PAYMENT_ID_INVALID');
    let claimed = false;
    try {
      let result;
      if (r.status === 'created') {
        const current = await adapter.verify(p, id);
        if (
          current.id !== id ||
          current.refunded !==
            Number(object(r.metadata).providerRefundedBefore ?? 0) ||
          r.amount > p.amount - current.refunded
        )
          throw new Error('REFUND_PAYMENT_REVIEW');
        claimed = (await this.repo.claimRefund(r.unique_id)).count === 1;
        if (claimed) result = await adapter.submit(p, id, r);
      } else result = await adapter.poll(p, id, r);
      if (result)
        r = await this.repo.saveRefundResult(
          r.unique_id,
          result.state,
          result.id,
        );
      else r = await this.repo.requireRefund(r.unique_id);
    } catch (e) {
      r = await this.repo.saveRefundResult(
        r.unique_id,
        claimed ? 'reconciliation_required' : r.status,
        undefined,
        {
          code: claimed
            ? e instanceof RefundGatewayException
              ? 'gateway_rejected_request'
              : 'gateway_outcome_unknown'
            : r.status === 'created'
              ? 'refund_preflight_unconfirmed'
              : 'refund_reconciliation_unconfirmed',
          upstreamStatus:
            e instanceof RefundGatewayException ? e.upstreamStatus : null,
          providerCode:
            e instanceof RefundGatewayException ? e.providerCode : null,
          providerRequestId:
            e instanceof RefundGatewayException ? e.providerRequestId : null,
          at: new Date().toISOString(),
        },
      );
    }
    if (r.status === 'succeeded')
      await this.repo.projectConfirmed(office, client, p.unique_id);
    return {
      id: r.unique_id,
      state: r.status,
      amount: r.amount,
      ...(object(r.metadata).lastFailure
        ? { lastFailure: object(r.metadata).lastFailure }
        : {}),
    };
  }
}
