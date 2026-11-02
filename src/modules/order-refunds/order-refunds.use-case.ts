import { MultiGatewayRefundService } from './multi-gateway-refund.service';
import { resolveMercadoPagoPaymentId } from './resolve-mercado-pago-payment-id';
import {
  isMercadoPagoProvider,
  supportsOrderRefund,
  supportsSubscriptionCancellation,
} from './refund-provider';
import { Injectable, ConflictException, Optional } from '@nestjs/common';
import { GetAuthContextUseCase } from '../../use-cases/get-auth-context/get-auth-context.use-case';
import { ResolveActorAuthorizationService } from '../security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ResolveActorAuthorizationDtoIn } from '../security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { OrderRefundsRepository } from './order-refunds.repository';
import {
  MercadoPagoRefundService,
  RefundGatewayException,
  RefundContextException,
  RefundPaymentContext,
} from './mercado-pago-refund.service';
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
    @Optional() private readonly multi?: MultiGatewayRefundService,
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
          supportsOrderRefund(p.api_credential?.provider) &&
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
        supported: supportsSubscriptionCancellation(s.api_credential?.provider),
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
      !supportsSubscriptionCancellation(c.provider) ||
      !c.token ||
      !s.gateway_subscription_id
    )
      throw new ConflictException('SUBSCRIPTION_REVIEW');
    if (!isMercadoPagoProvider(c.provider)) {
      if (!this.multi) throw new ConflictException('SUBSCRIPTION_REVIEW');
      await this.multi.cancel(s);
    } else
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
    if (!isMercadoPagoProvider(p.api_credential?.provider))
      throw new ConflictException('REFUND_RECONCILIATION_PROVIDER');
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
    const payment = resolveMercadoPagoPaymentId(p, r.metadata);
    const remote = await this.gateway.request(
      p.api_credential!.token!,
      payment,
      'GET',
      undefined,
      undefined,
      d.gatewayRefundId,
    );
    if (
      String(remote.id) !== d.gatewayRefundId ||
      String(remote.payment_id) !== payment ||
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
    if (
      p.api_credential?.provider &&
      !isMercadoPagoProvider(p.api_credential.provider)
    ) {
      if (!this.multi)
        throw new ConflictException('REFUND_PROVIDER_UNAVAILABLE');
      return this.multi.exec(a.officeId, a.clientId, p, d);
    }
    const tokenValue = p.api_credential!.token!;
    let r = await this.repo.findRefund(d.requestId);
    if (
      r &&
      (r.office_id !== a.officeId ||
        r.client_id !== a.clientId ||
        r.payment_transaction_id !== d.paymentId ||
        r.amount !== d.amount)
    )
      throw new ConflictException('REFUND_KEY_REUSED');
    if (r?.status === 'succeeded')
      await this.repo.projectConfirmed(a.officeId, a.clientId, d.paymentId);
    if (r && ['succeeded', 'failed'].includes(r.status))
      return { id: r.unique_id, state: r.status, amount: r.amount };
    const payment = resolveMercadoPagoPaymentId(p, r?.metadata);
    if (!r) {
      const remote = await this.gateway.request(tokenValue, payment, 'GET');
      if (
        String(remote.id) !== payment ||
        (p.external_reference != null &&
          String(remote.external_reference) !== p.external_reference) ||
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
      r = await this.repo.reserve(a.officeId, a.clientId, d, refunded, payment);
    }
    if (r.status === 'succeeded')
      await this.repo.projectConfirmed(a.officeId, a.clientId, d.paymentId);
    if (['succeeded', 'failed'].includes(r.status))
      return { id: r.unique_id, state: r.status, amount: r.amount };
    let result: Record<string, unknown> | null = null;
    let dispatchClaimed = false;
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
        const config = (p.config ?? {}) as Record<string, unknown>;
        const context = await this.gateway.preflight(tokenValue, payment, {
          amount: p.amount,
          currency: p.currency,
          reference: p.external_reference,
          amountToRefund: r.amount,
          context: config.refundPaymentContext as
            | RefundPaymentContext
            | undefined,
        });
        await this.repo.pinPaymentContext(
          a.officeId,
          a.clientId,
          p.unique_id,
          p.api_credential_id!,
          context,
        );
        const claimed = await this.repo.claimRefund(r.unique_id);
        if (claimed.count) {
          dispatchClaimed = true;
          result = await this.gateway.request(
            tokenValue,
            payment,
            'POST',
            r.unique_id,
            r.amount,
            undefined,
            r.amount === p.amount,
          );
        }
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
    } catch (error) {
      // Unknown outcomes reserve the amount and must never be dispatched again automatically.
      r = await this.repo.saveRefundResult(
        r.unique_id,
        r.gateway_refund_id
          ? 'processing'
          : dispatchClaimed
            ? 'reconciliation_required'
            : r.status,
        undefined,
        {
          code:
            error instanceof RefundContextException
              ? error.message.toLowerCase()
              : !dispatchClaimed && !r.gateway_refund_id
                ? 'refund_preflight_unconfirmed'
                : error instanceof RefundGatewayException
                  ? 'gateway_rejected_request'
                  : error instanceof Error &&
                      error.message === 'REFUND_RESPONSE_INVALID'
                    ? 'gateway_response_mismatch'
                    : 'gateway_outcome_unknown',
          upstreamStatus:
            error instanceof RefundGatewayException
              ? error.upstreamStatus
              : null,
          providerCode:
            error instanceof RefundGatewayException ? error.providerCode : null,
          providerRequestId:
            error instanceof RefundGatewayException
              ? error.providerRequestId
              : null,
          at: new Date().toISOString(),
        },
      );
    }
    if (r.status === 'succeeded')
      await this.repo.projectConfirmed(a.officeId, a.clientId, d.paymentId);
    const failure = (r.metadata as { lastFailure?: unknown } | null)
      ?.lastFailure;
    return {
      id: r.unique_id,
      state: r.status,
      amount: r.amount,
      ...(failure ? { lastFailure: failure } : {}),
    };
  }
}
