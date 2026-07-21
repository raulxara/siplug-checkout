export class UpdatePaymentTransactionDtoIn {
  public readonly _id: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly checkoutSessionId: string | null;
  public readonly paymentCustomerId: string | null;

  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly gatewayTransactionId: string | null;
  public readonly externalReference: string | null;
  public readonly idempotencyKey: string | null;

  public readonly paymentType: string | null;
  public readonly paymentMethod: string | null;

  public readonly amount: number | null;
  public readonly currency: string | null;

  public readonly installments: number | null;
  public readonly installmentAmount: number | null;
  public readonly interestAmount: number | null;
  public readonly interestType: string | null;

  public readonly gatewayStatus: string | null;
  public readonly status: string | null;
  public readonly processStatus: string | null;
  public readonly processMessage: string | null;

  public readonly providerPayload: Record<string, unknown> | null;
  public readonly providerResponse: Record<string, unknown> | null;
  public readonly gatewayResponse: Record<string, unknown> | null;

  public readonly qrCode: string | null;
  public readonly qrCodeBase64: string | null;
  public readonly boletoUrl: string | null;
  public readonly checkoutUrl: string | null;

  public readonly splitRequired: boolean | null;
  public readonly hasSplit: boolean | null;

  public readonly paidAt: string | null;
  public readonly authorizedAt: string | null;
  public readonly canceledAt: string | null;
  public readonly failedAt: string | null;
  public readonly refundedAt: string | null;
  public readonly expiresAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly source: string;

  constructor(params: {
    _id: string;

    officeId?: string | null;
    clientId?: string | null;
    checkoutSessionId?: string | null;
    paymentCustomerId?: string | null;

    gatewayId?: string | null;
    apiCredentialId?: string | null;

    gatewayTransactionId?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;

    paymentType?: string | null;
    paymentMethod?: string | null;

    amount?: number | null;
    currency?: string | null;

    installments?: number | null;
    installmentAmount?: number | null;
    interestAmount?: number | null;
    interestType?: string | null;

    gatewayStatus?: string | null;
    status?: string | null;
    processStatus?: string | null;
    processMessage?: string | null;

    providerPayload?: Record<string, unknown> | null;
    providerResponse?: Record<string, unknown> | null;
    gatewayResponse?: Record<string, unknown> | null;

    qrCode?: string | null;
    qrCodeBase64?: string | null;
    boletoUrl?: string | null;
    checkoutUrl?: string | null;

    splitRequired?: boolean | null;
    hasSplit?: boolean | null;

    paidAt?: string | null;
    authorizedAt?: string | null;
    canceledAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
    expiresAt?: string | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    source?: string;
  }) {
    this._id = params._id;

    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.checkoutSessionId = params.checkoutSessionId ?? null;
    this.paymentCustomerId = params.paymentCustomerId ?? null;

    this.gatewayId = params.gatewayId ?? null;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.gatewayTransactionId = params.gatewayTransactionId ?? null;
    this.externalReference = params.externalReference ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;

    this.paymentType = params.paymentType ?? null;
    this.paymentMethod = params.paymentMethod ?? null;

    this.amount = params.amount ?? null;
    this.currency = params.currency ?? null;

    this.installments = params.installments ?? null;
    this.installmentAmount = params.installmentAmount ?? null;
    this.interestAmount = params.interestAmount ?? null;
    this.interestType = params.interestType ?? null;

    this.gatewayStatus = params.gatewayStatus ?? null;
    this.status = params.status ?? null;
    this.processStatus = params.processStatus ?? null;
    this.processMessage = params.processMessage ?? null;

    this.providerPayload = params.providerPayload ?? null;
    this.providerResponse = params.providerResponse ?? null;
    this.gatewayResponse = params.gatewayResponse ?? null;

    this.qrCode = params.qrCode ?? null;
    this.qrCodeBase64 = params.qrCodeBase64 ?? null;
    this.boletoUrl = params.boletoUrl ?? null;
    this.checkoutUrl = params.checkoutUrl ?? null;

    this.splitRequired = params.splitRequired ?? null;
    this.hasSplit = params.hasSplit ?? null;

    this.paidAt = params.paidAt ?? null;
    this.authorizedAt = params.authorizedAt ?? null;
    this.canceledAt = params.canceledAt ?? null;
    this.failedAt = params.failedAt ?? null;
    this.refundedAt = params.refundedAt ?? null;
    this.expiresAt = params.expiresAt ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.source = params.source ?? 'UpdatePaymentTransactionService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }

    if (this.amount !== null) {
      if (!Number.isInteger(this.amount) || this.amount <= 0) {
        throw new Error('amount must be an integer greater than zero');
      }
    }
  }
}
