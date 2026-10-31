/** Existing Mercado Pago credential spellings accepted by Checkout. */
export function isMercadoPagoProvider(
  provider: string | null | undefined,
): boolean {
  return ['mercado_pago', 'mercadopago', 'mercado-pago'].includes(
    provider?.trim().toLowerCase() ?? '',
  );
}
