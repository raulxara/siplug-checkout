/** Shared by post-sale and the existing split reversal flow. Values are cents. */
export function mercadoPagoRefundBody(amount: number, full: boolean) {
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error('REFUND_AMOUNT_INVALID');
  return full ? {} : { amount: amount / 100 };
}
export function pagbankRefundBody(
  amount: number,
  splits?: { method: string; receivers: unknown[] },
) {
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error('REFUND_AMOUNT_INVALID');
  return { amount: { value: amount }, ...(splits ? { splits } : {}) };
}
export function safeGatewayRequestId(headers: Headers): string | null {
  const value =
    headers.get('x-request-id') ??
    headers.get('x-correlation-id') ??
    headers.get('request-id');
  return value && /^[a-zA-Z0-9_.:-]{1,150}$/.test(value) ? value : null;
}
