import { ConflictException } from '@nestjs/common';

type PaymentIdentifiers = {
  gateway_transaction_id?: string | null;
  provider_response?: unknown;
  gateway_response?: unknown;
};
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const numericId = (value: unknown): string | undefined => {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) return;
  if (typeof value !== 'string' && typeof value !== 'number') return;
  const id = String(value);
  return /^[1-9][0-9]{0,24}$/.test(id) ? id : undefined;
};
/** Checkout Pro stores a preference in gateway_transaction_id. Only payment IDs can be refunded. */
export function resolveMercadoPagoPaymentId(
  payment: PaymentIdentifiers,
  metadata?: unknown,
): string {
  const pinned = numericId(object(metadata).gatewayPaymentId);
  if (pinned) return pinned; // The refund reservation fixes its target for all subsequent attempts.
  const canonical = object(object(payment.gateway_response).latestWebhook);
  const payload = object(
    object(payment.provider_response).latestWebhookPayload,
  );
  const ids = [
    payment.gateway_transaction_id,
    canonical.gatewayTransactionId,
    canonical.gatewayChargeId,
    object(payload.payment).id,
  ]
    .map(numericId)
    .filter((id): id is string => !!id);
  const unique = [...new Set(ids)];
  if (unique.length !== 1)
    throw new ConflictException(
      unique.length
        ? 'REFUND_PAYMENT_ID_CONFLICT'
        : 'REFUND_PAYMENT_ID_UNAVAILABLE',
    );
  return unique[0];
}
