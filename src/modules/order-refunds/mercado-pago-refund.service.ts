import {
  mercadoPagoRefundBody,
  safeGatewayRequestId,
} from './refund-request-body';
import {
  Injectable,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
export class RefundGatewayException extends ServiceUnavailableException {
  constructor(
    readonly upstreamStatus: number,
    readonly providerCode: string | null,
    readonly providerRequestId: string | null = null,
  ) {
    super('REFUND_GATEWAY_REVIEW');
  }
}
export class RefundContextException extends ConflictException {}
export type RefundPaymentContext = {
  paymentId: string;
  liveMode: boolean;
  collectorId: string;
  applicationId?: string;
};
@Injectable()
export class MercadoPagoRefundService {
  constructor(private readonly crypto: DecryptApiCredentialSecretService) {}
  private token(encrypted: string) {
    const d = this.crypto.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: { config: { token: encrypted } },
        keysToDecrypt: ['token'],
        strict: true,
      }),
    );
    return String(
      (d.apiCredential.config as Record<string, unknown>).token ?? '',
    );
  }
  async preflight(
    encrypted: string,
    payment: string,
    expected: {
      amount: number;
      currency: string;
      reference?: string | null;
      amountToRefund: number;
      context?: RefundPaymentContext;
    },
  ): Promise<RefundPaymentContext> {
    const token = this.token(encrypted);
    const remote = await this.request(encrypted, payment, 'GET');
    if (
      typeof remote.live_mode !== 'boolean' ||
      (!token.startsWith('TEST-') && !token.startsWith('APP_USR-'))
    )
      throw new RefundContextException('REFUND_ENVIRONMENT_UNVERIFIED');
    if (remote.live_mode !== token.startsWith('APP_USR-'))
      throw new RefundContextException('REFUND_ENVIRONMENT_MISMATCH');
    const refunded = Math.round(
      Number(remote.transaction_amount_refunded ?? 0) * 100,
    );
    if (
      String(remote.id) !== payment ||
      remote.status !== 'approved' ||
      remote.currency_id !== expected.currency ||
      Math.round(Number(remote.transaction_amount) * 100) !== expected.amount ||
      (expected.reference != null &&
        remote.external_reference !== expected.reference) ||
      !Number.isSafeInteger(refunded) ||
      refunded < 0 ||
      expected.amountToRefund > expected.amount - refunded
    )
      throw new RefundContextException('REFUND_PAYMENT_REVIEW');
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: { Authorization: 'Bearer ' + token },
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new RefundContextException('REFUND_CREDENTIAL_UNVERIFIED');
    const seller = (await response.json()) as { id?: unknown };
    if (
      !seller.id ||
      !remote.collector_id ||
      String(seller.id) !== String(remote.collector_id)
    )
      throw new RefundContextException('REFUND_SELLER_MISMATCH');
    const context: RefundPaymentContext = {
      paymentId: payment,
      liveMode: remote.live_mode,
      collectorId: String(remote.collector_id),
      ...(remote.application_id
        ? { applicationId: String(remote.application_id) }
        : {}),
    };
    const pinned = expected.context;
    if (
      pinned &&
      (pinned.paymentId !== context.paymentId ||
        pinned.liveMode !== context.liveMode ||
        pinned.collectorId !== context.collectorId ||
        (pinned.applicationId &&
          pinned.applicationId !== context.applicationId))
    )
      throw new RefundContextException('REFUND_CONTEXT_MISMATCH');
    return context;
  }
  async cancelSubscription(
    encrypted: string,
    id: string,
    reference: string,
  ): Promise<void> {
    const url =
      'https://api.mercadopago.com/preapproval/' + encodeURIComponent(id);
    const headers = {
      Authorization: 'Bearer ' + this.token(encrypted),
      'Content-Type': 'application/json',
    };
    const current = await fetch(url, {
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
    });
    if (!current.ok)
      throw new ServiceUnavailableException('SUBSCRIPTION_REVIEW');
    const c = (await current.json()) as {
      id: string;
      external_reference: string;
      status: string;
    };
    if (c.id !== id || c.external_reference !== reference)
      throw new BadRequestException('SUBSCRIPTION_MISMATCH');
    if (c.status === 'cancelled') return;
    if (!['authorized', 'paused', 'pending'].includes(c.status))
      throw new BadRequestException('SUBSCRIPTION_STATE');
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: 'cancelled' }),
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new ServiceUnavailableException('SUBSCRIPTION_REVIEW');
    const r = (await response.json()) as { id: string; status: string };
    if (r.id !== id || r.status !== 'cancelled')
      throw new ServiceUnavailableException('SUBSCRIPTION_REVIEW');
  }
  async request(
    encrypted: string,
    payment: string,
    method: 'GET' | 'POST',
    key?: string,
    amount?: number,
    refund?: string,
    fullRefund = false,
  ): Promise<Record<string, unknown>> {
    if (!/^\d+$/.test(payment))
      throw new BadRequestException('REFUND_PAYMENT_INVALID');
    const url =
      'https://api.mercadopago.com/v1/payments/' +
      payment +
      (method === 'POST' || refund ? '/refunds' : '') +
      (refund ? '/' + encodeURIComponent(refund) : '');
    const response = await fetch(url, {
      method,
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
      headers: {
        Authorization: 'Bearer ' + this.token(encrypted),
        'Content-Type': 'application/json',
        ...(key ? { 'X-Idempotency-Key': key } : {}),
      },
      ...(method === 'POST'
        ? { body: JSON.stringify(mercadoPagoRefundBody(amount!, fullRefund)) }
        : {}),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: unknown;
        code?: unknown;
      } | null;
      const raw = body?.error ?? body?.code;
      const code =
        (typeof raw === 'string' || typeof raw === 'number') &&
        /^[a-zA-Z0-9_.-]{1,100}$/.test(String(raw))
          ? String(raw)
          : null;
      throw new RefundGatewayException(
        response.status,
        code,
        safeGatewayRequestId(response.headers),
      );
    }
    return (await response.json()) as Record<string, unknown>;
  }
}
