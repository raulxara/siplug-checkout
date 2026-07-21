export class FetchMercadoPagoPaymentDtoOut {
  constructor(
    public readonly gatewayTransactionId: string | null,
    public readonly gatewayStatus: string | null,
    public readonly status: string,
    public readonly processStatus: string,
    public readonly processMessage: string,
    public readonly providerResponse: Record<string, unknown>,
    public readonly gatewayResponse: Record<string, unknown>,
    public readonly qrCode: string | null,
    public readonly qrCodeBase64: string | null,
    public readonly checkoutUrl: string | null,
    public readonly paidAt: string | null,
    public readonly authorizedAt: string | null,
    public readonly canceledAt: string | null,
    public readonly failedAt: string | null,
    public readonly refundedAt: string | null,
    public readonly expiresAt: string | null,
  ) {}
}