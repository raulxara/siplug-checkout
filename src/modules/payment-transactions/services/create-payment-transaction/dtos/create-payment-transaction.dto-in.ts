export class CreatePaymentTransactionDtoIn {
  public readonly officeId: string;
  public readonly clientId: string;
  public readonly checkoutSessionId: string | null;
  public readonly paymentCustomerId: string | null;

  public readonly gatewayId: string;
  public readonly apiCredentialId: string | null;

  public readonly gatewayTransactionId: string | null;
  public readonly externalReference: string | null;
  public readonly idempotencyKey: string | null;

  public readonly paymentType: string;
  public readonly paymentMethod: string;

  public readonly amount: number;
  public readonly currency: string;

  public readonly installments: number | null;
  public readonly installmentAmount: number | null;
  public readonly interestAmount: number | null;
  public readonly interestType: string | null;

  public readonly gatewayStatus: string | null;
  public readonly status: string;
  public readonly processStatus: string;
  public readonly processMessage: string | null;

  public readonly providerPayload: Record<string, unknown> | null;
  public readonly providerResponse: Record<string, unknown> | null;
  public readonly gatewayResponse: Record<string, unknown> | null;

  public readonly qrCode: string | null;
  public readonly qrCodeBase64: string | null;
  public readonly boletoUrl: string | null;
  public readonly checkoutUrl: string | null;

  public readonly splitRequired: boolean;
  public readonly hasSplit: boolean;

  public readonly paidAt: string | null;
  public readonly authorizedAt: string | null;
  public readonly canceledAt: string | null;
  public readonly failedAt: string | null;
  public readonly refundedAt: string | null;
  public readonly expiresAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    officeId: string;
    clientId: string;
    checkoutSessionId?: string | null;
    paymentCustomerId?: string | null;

    gatewayId: string;
    apiCredentialId?: string | null;

    gatewayTransactionId?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;

    paymentType: string;
    paymentMethod: string;

    amount: number;
    currency?: string;

    installments?: number | null;
    installmentAmount?: number | null;
    interestAmount?: number | null;
    interestType?: string | null;

    gatewayStatus?: string | null;
    status?: string;
    processStatus?: string;
    processMessage?: string | null;

    providerPayload?: Record<string, unknown> | null;
    providerResponse?: Record<string, unknown> | null;
    gatewayResponse?: Record<string, unknown> | null;

    qrCode?: string | null;
    qrCodeBase64?: string | null;
    boletoUrl?: string | null;
    checkoutUrl?: string | null;

    splitRequired?: boolean;
    hasSplit?: boolean;

    paidAt?: string | null;
    authorizedAt?: string | null;
    canceledAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
    expiresAt?: string | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
  }) {
    this.officeId = params.officeId;
    this.clientId = params.clientId;
    this.checkoutSessionId = params.checkoutSessionId ?? null;
    this.paymentCustomerId = params.paymentCustomerId ?? null;

    this.gatewayId = params.gatewayId;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.gatewayTransactionId = params.gatewayTransactionId ?? null;
    this.externalReference = params.externalReference ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;

    this.paymentType = params.paymentType;
    this.paymentMethod = params.paymentMethod;

    this.amount = Number(params.amount);
    this.currency = params.currency ?? 'BRL';

    this.installments = params.installments ?? null;
    this.installmentAmount = params.installmentAmount ?? null;
    this.interestAmount = params.interestAmount ?? null;
    this.interestType = params.interestType ?? null;

    this.gatewayStatus = params.gatewayStatus ?? null;
    this.status = params.status ?? 'created';
    this.processStatus = params.processStatus ?? 'pending';
    this.processMessage = params.processMessage ?? null;

    this.providerPayload = params.providerPayload ?? null;
    this.providerResponse = params.providerResponse ?? null;
    this.gatewayResponse = params.gatewayResponse ?? null;

    this.qrCode = params.qrCode ?? null;
    this.qrCodeBase64 = params.qrCodeBase64 ?? null;
    this.boletoUrl = params.boletoUrl ?? null;
    this.checkoutUrl = params.checkoutUrl ?? null;

    this.splitRequired = params.splitRequired ?? false;
    this.hasSplit = params.hasSplit ?? false;

    this.paidAt = params.paidAt ?? null;
    this.authorizedAt = params.authorizedAt ?? null;
    this.canceledAt = params.canceledAt ?? null;
    this.failedAt = params.failedAt ?? null;
    this.refundedAt = params.refundedAt ?? null;
    this.expiresAt = params.expiresAt ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (this.gatewayId.trim() === '') {
      throw new Error('gatewayId is required');
    }

    if (this.paymentType.trim() === '') {
      throw new Error('paymentType is required');
    }

    if (this.paymentMethod.trim() === '') {
      throw new Error('paymentMethod is required');
    }

    if (!Number.isInteger(this.amount) || this.amount <= 0) {
      throw new Error('amount must be an integer greater than zero');
    }

    if (this.currency.trim() === '') {
      throw new Error('currency is required');
    }
  }
}
