/** Existing Mercado Pago credential spellings accepted by Checkout. */
export function isMercadoPagoProvider(
  provider: string | null | undefined,
): boolean {
  return ['mercado_pago', 'mercadopago', 'mercado-pago'].includes(
    provider?.trim().toLowerCase() ?? '',
  );
}

export function supportsOrderRefund(provider?: string | null): boolean {
  return (
    isMercadoPagoProvider(provider) ||
    ['pagseguro', 'pagbank', 'paypal', 'stripe'].includes(
      provider?.trim().toLowerCase() ?? '',
    )
  );
}
export function supportsSubscriptionCancellation(
  provider?: string | null,
): boolean {
  return (
    isMercadoPagoProvider(provider) ||
    ['paypal', 'stripe'].includes(provider?.trim().toLowerCase() ?? '')
  );
}
