export class CreateCheckoutSessionDtoIn {
  public readonly officeId: string;
  public readonly clientId: string;
  public readonly paymentCustomerId: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly code: string | null;
  public readonly externalReference: string | null;
  public readonly idempotencyKey: string | null;

  public readonly paymentType: string;
  public readonly amount: number;
  public readonly currency: string;
  public readonly description: string | null;

  public readonly successUrl: string | null;
  public readonly cancelUrl: string | null;
  public readonly expiresAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    officeId: string;
    clientId: string;
    paymentCustomerId?: string | null;
    gatewayId: string | null;
    apiCredentialId?: string | null;

    code?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;

    paymentType: string;
    amount: number;
    currency?: string;
    description?: string | null;

    successUrl?: string | null;
    cancelUrl?: string | null;
    expiresAt?: string | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string;
  }) {
    this.officeId = params.officeId;
    this.clientId = params.clientId;
    this.paymentCustomerId = params.paymentCustomerId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.code = params.code ?? null;
    this.externalReference = params.externalReference ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;

    this.paymentType = params.paymentType;
    this.amount = Number(params.amount);
    this.currency = params.currency ?? 'BRL';
    this.description = params.description ?? null;

    this.successUrl = params.successUrl ?? null;
    this.cancelUrl = params.cancelUrl ?? null;
    this.expiresAt = params.expiresAt ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? 'created';

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (this.paymentType.trim() === '') {
      throw new Error('paymentType is required');
    }

    if (!Number.isFinite(this.amount) || this.amount <= 0) {
      throw new Error('amount must be greater than zero');
    }

    if (this.currency.trim() === '') {
      throw new Error('currency is required');
    }
  }
}
