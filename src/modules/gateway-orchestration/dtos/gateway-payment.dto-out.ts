export class GatewayPaymentDtoOut {
  public readonly success: boolean;
  public readonly provider: string;

  public readonly gatewayTransactionId: string | null;
  public readonly gatewayStatus: string | null;

  public readonly status: string;
  public readonly processStatus: string;
  public readonly processMessage: string | null;

  public readonly providerRequest: Record<string, unknown> | null;
  public readonly providerResponse: Record<string, unknown> | null;
  public readonly gatewayResponse: Record<string, unknown> | null;

  public readonly qrCode: string | null;
  public readonly qrCodeBase64: string | null;
  public readonly boletoUrl: string | null;
  public readonly checkoutUrl: string | null;

  public readonly paidAt: string | null;
  public readonly authorizedAt: string | null;
  public readonly canceledAt: string | null;
  public readonly failedAt: string | null;
  public readonly refundedAt: string | null;
  public readonly expiresAt: string | null;

  constructor(params: {
    success: boolean;
    provider: string;

    gatewayTransactionId?: string | null;
    gatewayStatus?: string | null;

    status: string;
    processStatus: string;
    processMessage?: string | null;

    providerRequest?: Record<string, unknown> | null;
    providerResponse?: Record<string, unknown> | null;
    gatewayResponse?: Record<string, unknown> | null;

    qrCode?: string | null;
    qrCodeBase64?: string | null;
    boletoUrl?: string | null;
    checkoutUrl?: string | null;

    paidAt?: string | null;
    authorizedAt?: string | null;
    canceledAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
    expiresAt?: string | null;
  }) {
    this.success = params.success;
    this.provider = params.provider;

    this.gatewayTransactionId = params.gatewayTransactionId ?? null;
    this.gatewayStatus = params.gatewayStatus ?? null;

    this.status = params.status;
    this.processStatus = params.processStatus;
    this.processMessage = params.processMessage ?? null;

    this.providerRequest = params.providerRequest ?? null;
    this.providerResponse = params.providerResponse ?? null;
    this.gatewayResponse = params.gatewayResponse ?? null;

    this.qrCode = params.qrCode ?? null;
    this.qrCodeBase64 = params.qrCodeBase64 ?? null;
    this.boletoUrl = params.boletoUrl ?? null;
    this.checkoutUrl = params.checkoutUrl ?? null;

    this.paidAt = params.paidAt ?? null;
    this.authorizedAt = params.authorizedAt ?? null;
    this.canceledAt = params.canceledAt ?? null;
    this.failedAt = params.failedAt ?? null;
    this.refundedAt = params.refundedAt ?? null;
    this.expiresAt = params.expiresAt ?? null;
  }
}
