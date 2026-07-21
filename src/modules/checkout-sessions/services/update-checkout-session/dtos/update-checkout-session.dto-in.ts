export class UpdateCheckoutSessionDtoIn {
  public readonly _id: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly paymentCustomerId: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly code: string | null;
  public readonly externalReference: string | null;
  public readonly idempotencyKey: string | null;

  public readonly paymentType: string | null;
  public readonly amount: number | null;
  public readonly currency: string | null;
  public readonly description: string | null;

  public readonly successUrl: string | null;
  public readonly cancelUrl: string | null;
  public readonly expiresAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;

    officeId?: string | null;
    clientId?: string | null;
    paymentCustomerId?: string | null;
    gatewayId?: string | null;
    apiCredentialId?: string | null;

    code?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;

    paymentType?: string | null;
    amount?: number | null;
    currency?: string | null;
    description?: string | null;

    successUrl?: string | null;
    cancelUrl?: string | null;
    expiresAt?: string | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;

    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.paymentCustomerId = params.paymentCustomerId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.code = params.code ?? null;
    this.externalReference = params.externalReference ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;

    this.paymentType = params.paymentType ?? null;
    this.amount = params.amount ?? null;
    this.currency = params.currency ?? null;
    this.description = params.description ?? null;

    this.successUrl = params.successUrl ?? null;
    this.cancelUrl = params.cancelUrl ?? null;
    this.expiresAt = params.expiresAt ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateCheckoutSessionService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}