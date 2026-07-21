export class UpdatePaymentTransactionUseCaseDtoIn {
  public readonly token: string;
  public readonly paymentTransactionId: string;

  public readonly status: string | null;
  public readonly gatewayStatus: string | null;
  public readonly processStatus: string | null;
  public readonly processMessage: string | null;

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

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    token: string;
    paymentTransactionId: string;

    status?: string | null;
    gatewayStatus?: string | null;
    processStatus?: string | null;
    processMessage?: string | null;

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

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
  }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (
      !params.paymentTransactionId ||
      params.paymentTransactionId.trim() === ''
    ) {
      throw new Error('paymentTransactionId is required');
    }

    this.token = params.token.trim();
    this.paymentTransactionId = params.paymentTransactionId.trim();

    this.status = this.normalizeNullableString(params.status);
    this.gatewayStatus = this.normalizeNullableString(params.gatewayStatus);
    this.processStatus = this.normalizeNullableString(params.processStatus);
    this.processMessage = this.normalizeNullableString(params.processMessage);

    this.qrCode = this.normalizeNullableString(params.qrCode);
    this.qrCodeBase64 = this.normalizeNullableString(params.qrCodeBase64);
    this.boletoUrl = this.normalizeNullableString(params.boletoUrl);
    this.checkoutUrl = this.normalizeNullableString(params.checkoutUrl);

    this.paidAt = this.normalizeNullableString(params.paidAt);
    this.authorizedAt = this.normalizeNullableString(params.authorizedAt);
    this.canceledAt = this.normalizeNullableString(params.canceledAt);
    this.failedAt = this.normalizeNullableString(params.failedAt);
    this.refundedAt = this.normalizeNullableString(params.refundedAt);
    this.expiresAt = this.normalizeNullableString(params.expiresAt);

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;
  }

  private normalizeNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
