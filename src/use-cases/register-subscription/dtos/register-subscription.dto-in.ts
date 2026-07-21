export class RegisterSubscriptionDtoIn {
  public readonly token: string;

  public readonly officeId: string;
  public readonly clientId: string;

  public readonly subscriptionPlanId: string;
  public readonly paymentCustomerId: string;

  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly externalReference: string | null;

  public readonly amount: number | null;
  public readonly currency: string | null;

  public readonly nextBillingAt: string | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    token: string;

    officeId: string;
    clientId: string;

    subscriptionPlanId: string;
    paymentCustomerId: string;

    gatewayId?: string | null;
    apiCredentialId?: string | null;

    externalReference?: string | null;

    amount?: number | null;
    currency?: string | null;

    nextBillingAt?: string | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string | null;
  }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (!params.officeId || params.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (!params.clientId || params.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (!params.subscriptionPlanId || params.subscriptionPlanId.trim() === '') {
      throw new Error('subscriptionPlanId is required');
    }

    if (!params.paymentCustomerId || params.paymentCustomerId.trim() === '') {
      throw new Error('paymentCustomerId is required');
    }

    if (
      params.amount !== undefined &&
      params.amount !== null &&
      (!Number.isInteger(params.amount) || params.amount <= 0)
    ) {
      throw new Error('amount must be a positive integer in cents');
    }

    this.token = params.token.trim();

    this.officeId = params.officeId.trim();
    this.clientId = params.clientId.trim();

    this.subscriptionPlanId = params.subscriptionPlanId.trim();
    this.paymentCustomerId = params.paymentCustomerId.trim();

    this.gatewayId = this.normalizeNullableString(params.gatewayId);
    this.apiCredentialId = this.normalizeNullableString(
      params.apiCredentialId,
    );

    this.externalReference = this.normalizeNullableString(
      params.externalReference,
    );

    this.amount = params.amount ?? null;
    this.currency = this.normalizeNullableString(params.currency);

    this.nextBillingAt = this.normalizeNullableString(params.nextBillingAt);

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status?.trim() || 'created';
  }

  private normalizeNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}