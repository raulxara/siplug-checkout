export class GatewayPaymentStatusDtoOut {
  constructor(
    public readonly success: boolean,
    public readonly provider: string,

    public readonly gatewayTransactionId: string | null,
    public readonly gatewayStatus: string | null,

    public readonly status: string,
    public readonly processStatus: string,
    public readonly processMessage: string,

    public readonly providerRequest: Record<string, unknown> | null,
    public readonly providerResponse: Record<string, unknown> | null,
    public readonly gatewayResponse: Record<string, unknown> | null,

    public readonly qrCode: string | null = null,
    public readonly qrCodeBase64: string | null = null,
    public readonly boletoUrl: string | null = null,
    public readonly checkoutUrl: string | null = null,

    public readonly paidAt: string | null = null,
    public readonly authorizedAt: string | null = null,
    public readonly canceledAt: string | null = null,
    public readonly failedAt: string | null = null,
    public readonly refundedAt: string | null = null,
    public readonly expiresAt: string | null = null,
  ) {}
}
