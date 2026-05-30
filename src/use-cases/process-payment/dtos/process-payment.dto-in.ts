export class ProcessPaymentDtoIn {
  public readonly token: string;

  public readonly checkoutSessionId: string;
  public readonly paymentMethod: string;

  public readonly installments: number | null;
  public readonly installmentAmount: number | null;
  public readonly interestAmount: number | null;
  public readonly interestType: string | null;

  public readonly idempotencyKey: string | null;
  public readonly externalReference: string | null;

  public readonly payer: Record<string, unknown> | null;
  public readonly paymentData: Record<string, unknown> | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly gatewayProvider: string | null;
  public readonly gatewaySlug: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  constructor(params: {
    token?: string;

    checkoutSessionId?: string;
    paymentMethod?: string;

    installments?: number | null;
    installmentAmount?: number | null;
    interestAmount?: number | null;
    interestType?: string | null;

    idempotencyKey?: string | null;
    externalReference?: string | null;

    payer?: Record<string, unknown> | null;
    paymentData?: Record<string, unknown> | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    gatewayProvider?: unknown;
    gatewaySlug?: unknown;
    gatewayId?: unknown;
    apiCredentialId?: unknown;
  }) {
    this.token = params.token ?? '';

    this.checkoutSessionId = params.checkoutSessionId ?? '';
    this.paymentMethod = params.paymentMethod ?? '';

    this.installments = params.installments ?? null;
    this.installmentAmount = params.installmentAmount ?? null;
    this.interestAmount = params.interestAmount ?? null;
    this.interestType = params.interestType ?? null;

    this.idempotencyKey = params.idempotencyKey ?? null;
    this.externalReference = params.externalReference ?? null;

    this.payer = params.payer ?? null;
    this.paymentData = params.paymentData ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.gatewayProvider =
      params.gatewayProvider !== undefined && params.gatewayProvider !== null
        ? String(params.gatewayProvider).trim()
        : null;

    this.gatewaySlug =
      params.gatewaySlug !== undefined && params.gatewaySlug !== null
        ? String(params.gatewaySlug).trim()
        : null;

    this.gatewayId =
      params.gatewayId !== undefined && params.gatewayId !== null
        ? String(params.gatewayId).trim()
        : null;

    this.apiCredentialId =
      params.apiCredentialId !== undefined && params.apiCredentialId !== null
        ? String(params.apiCredentialId).trim()
        : null;

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }

    if (this.paymentMethod.trim() === '') {
      throw new Error('paymentMethod is required');
    }

    if (this.installments !== null) {
      if (!Number.isInteger(this.installments) || this.installments <= 0) {
        throw new Error('installments must be an integer greater than zero');
      }
    }

    if (this.installmentAmount !== null) {
      if (
        !Number.isInteger(this.installmentAmount) ||
        this.installmentAmount <= 0
      ) {
        throw new Error(
          'installmentAmount must be an integer greater than zero',
        );
      }
    }

    if (this.interestAmount !== null) {
      if (!Number.isInteger(this.interestAmount) || this.interestAmount < 0) {
        throw new Error(
          'interestAmount must be an integer greater than or equal to zero',
        );
      }
    }
  }
}
