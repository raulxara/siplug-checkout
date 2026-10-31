import { isMercadoPagoProvider } from './refund-provider';
import { Injectable, ConflictException } from '@nestjs/common';
import { GetAuthContextUseCase } from '../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { OrderRefundsRepository } from './order-refunds.repository';
import { MercadoPagoRefundService } from './mercado-pago-refund.service';
import {
  OrderRefundDto,
  CancelOrderSubscriptionDto,
  ReconcileOrderRefundDto,
} from './order-refunds.dto';
@Injectable()
export class OrderRefundsUseCase {
  constructor(
    private readonly identity: GetAuthContextUseCase,
    private readonly auth: ResolveActorAuthorizationService,
    private readonly repo: OrderRefundsRepository,
    private readonly gateway: MercadoPagoRefundService,
  ) {}
  private async actor(token: string, write: boolean) {
    await this.auth.exec(
      new ResolveActorAuthorizationDtoIn({
        token,
        requiredEntity: write ? 'payment_refunds' : 'checkout_sessions',
        requiredAction: write
          ? 'refundOrderPayment'
          : 'listCheckoutSessionsByOfficeId',
      }),
    );
    return this.identity.exec(token);
  }
  async list(token: string, order: string) {
    const a = await this.actor(token, false);
    const rows = await this.repo.payments(a.officeId, a.clientId, order);
    return {
      items: rows.map((p) => ({
        id: p.unique_id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        supported:
          isMercadoPagoProvider(p.api_credential?.provider) &&
          !p.has_split &&
          !p.split_required,
        refunds: p.refunds.map((r) => ({
          id: r.unique_id,
          amount: r.amount,
          state: r.status,
        })),
      })),
    };
  }
  async subscriptions(token: string, order: string) {
    const a = await this.actor(token, false);
    const rows = await this.repo.subscriptions(a.officeId, a.clientId, order);
    return {
      items: rows.map((s) => ({
        id: s.unique_id,
        status: s.status,
        amount: s.amount,
        supported: isMercadoPagoProvider(s.api_credential?.provider),
        endedAt: s.ended_at,
      })),
    };
  }
  async cancelSubscription(token: string, d: CancelOrderSubscriptionDto) {
    const a = await this.actor(token, true);
    const s = await this.repo.subscription(
      a.officeId,
      a.clientId,
      d.orderId,
      d.subscriptionId,
    );
    const c = s?.api_credential;
    if (
      !s ||
      !c ||
      c.office_id !== a.officeId ||
      (c.client_id && c.client_id !== a.clientId) ||
      c.status !== 'active' ||
      !isMercadoPagoProvider(c.provider) ||
      !c.token ||
      !s.gateway_subscription_id
    )
      throw new ConflictException('SUBSCRIPTION_REVIEW');
    await this.gateway.cancelSubscription(
      c.token,
      s.gateway_subscription_id,
      s.external_reference!,
    );
    await this.repo.completeSubscription(
      a.officeId,
      a.clientId,
      s.unique_id,
      d.access === 'immediate',
    );
    return { id: s.unique_id, state: 'canceled' };
  }
  async reconcile(token: string, d: ReconcileOrderRefundDto) {
    const a = await this.actor(token, true);
    const p = await this.repo.payment(a.officeId, a.clientId, d);
    const r = await this.repo.findRefund(d.requestId);
    if (
      !r ||
      r.office_id !== a.officeId ||
      r.client_id !== a.clientId ||
      r.payment_transaction_id !== d.paymentId ||
      r.amount !== d.amount ||
      !['reconciliation_required', 'submitted', 'processing'].includes(r.status)
    )
      throw new ConflictException('REFUND_RECONCILIATION_INVALID');
    const remote = await this.gateway.request(
      p.api_credential!.token!,
      p.gateway_transaction_id!,
      'GET',
      undefined,
      undefined,
      d.gatewayRefundId,
    );
    if (
      String(remote.id) !== d.gatewayRefundId ||
      String(remote.payment_id) !== p.gateway_transaction_id ||
      Math.round(Number(remote.amount) * 100) !== r.amount ||
      !Number.isFinite(Date.parse(String(remote.date_created))) ||
      Date.parse(String(remote.date_created)) < r.created_at.getTime() - 300000
    )
      throw new ConflictException('REFUND_RECONCILIATION_MISMATCH');
    await this.repo.attachRefund(
      a.officeId,
      a.clientId,
      d,
      d.gatewayRefundId,
      remote.status === 'approved'
        ? 'succeeded'
        : remote.status === 'rejected'
          ? 'failed'
          : 'processing',
    );
    return this.exec(token, d);
  }
  async exec(token: string, d: OrderRefundDto) {
    const a = await this.actor(token, true);
    const p = await this.repo.payment(a.officeId, a.clientId, d);
    const tokenValue = p.api_credential!.token!;
    const payment = p.gateway_transaction_id ?? '';
    let r = await this.repo.findRefund(d.requestId);
    if (
      r &&
      (r.office_id !== a.officeId ||
        r.client_id !== a.clientId ||
        r.payment_transaction_id !== d.paymentId ||
        r.amount !== d.amount)
    )
      throw new ConflictException('REFUND_KEY_REUSED');
    if (!r) {
      const remote = await this.gateway.request(tokenValue, payment, 'GET');
      if (
        remote.status !== 'approved' ||
        remote.currency_id !== p.currency ||
        Math.round(Number(remote.transaction_amount) * 100) !== p.amount
      )
        throw new ConflictException('REFUND_PAYMENT_REVIEW');
      const refunded = Math.round(
        Number(remote.transaction_amount_refunded ?? 0) * 100,
      );
      if (!Number.isSafeInteger(refunded) || refunded < 0)
        throw new ConflictException('REFUND_PAYMENT_REVIEW');
      r = await this.repo.reserve(a.officeId, a.clientId, d, refunded);
    }
    if (r.status === 'succeeded')
      await this.repo.projectConfirmed(a.officeId, a.clientId, d.paymentId);
    if (['succeeded', 'failed'].includes(r.status))
      return { id: r.unique_id, state: r.status, amount: r.amount };
    let result: Record<string, unknown> | null = null;
    try {
      if (r.gateway_refund_id)
        result = await this.gateway.request(
          tokenValue,
          payment,
          'GET',
          undefined,
          undefined,
          r.gateway_refund_id,
        );
      else if (r.status === 'created') {
        const claimed = await this.repo.claimRefund(r.unique_id);
        if (claimed.count)
          result = await this.gateway.request(
            tokenValue,
            payment,
            'POST',
            r.unique_id,
            r.amount,
          );
      }
      if (result) {
        if (
          String(result.payment_id) !== payment ||
          Math.round(Number(result.amount) * 100) !== r.amount ||
          !result.id
        )
          throw new Error('REFUND_RESPONSE_INVALID');
        const state =
          result.status === 'approved'
            ? 'succeeded'
            : result.status === 'rejected'
              ? 'failed'
              : 'processing';
        r = await this.repo.saveRefundResult(
          r.unique_id,
          state,
          String(result.id),
        );
      } else r = await this.repo.requireRefund(r.unique_id);
    } catch {
      // Unknown outcomes reserve the amount and must never be dispatched again automatically.
      r = await this.repo.saveRefundResult(
        r.unique_id,
        r.gateway_refund_id ? 'processing' : 'reconciliation_required',
      );
    }
    if (r.status === 'succeeded')
      await this.repo.projectConfirmed(a.officeId, a.clientId, d.paymentId);
    return { id: r.unique_id, state: r.status, amount: r.amount };
  }
}
