export class UpdateSubscriptionPlanDtoIn {
  public readonly token: string;
  public readonly subscriptionPlanId: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly description: string | null;

  public readonly billingInterval: string | null;
  public readonly billingIntervalCount: number | null;

  public readonly amount: number | null;
  public readonly currency: string | null;

  public readonly trialDays: number | null;
  public readonly maxBillingCycles: number | null;

  public readonly gatewayPlanId: string | null;
  public readonly paymentMethods: string[] | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;

  constructor(params: {
    token?: unknown;
    subscriptionPlanId?: unknown;

    officeId?: unknown;
    clientId?: unknown;
    gatewayId?: unknown;
    apiCredentialId?: unknown;

    name?: unknown;
    slug?: unknown;
    description?: unknown;

    billingInterval?: unknown;
    billingIntervalCount?: unknown;

    amount?: unknown;
    currency?: unknown;

    trialDays?: unknown;
    maxBillingCycles?: unknown;

    gatewayPlanId?: unknown;
    paymentMethods?: unknown;

    metadata?: unknown;
    config?: unknown;

    status?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionPlanId = String(params.subscriptionPlanId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionPlanId === '') {
      throw new Error('subscriptionPlanId is required');
    }

    this.officeId = this.toNullableString(params.officeId);
    this.clientId = this.toNullableString(params.clientId);
    this.gatewayId = this.toNullableString(params.gatewayId);
    this.apiCredentialId = this.toNullableString(params.apiCredentialId);

    this.name = this.toNullableString(params.name);
    this.slug = this.toNullableString(params.slug);
    this.description = this.toNullableString(params.description);

    this.billingInterval = this.toNullableString(params.billingInterval);
    this.billingIntervalCount = this.toNullableNumber(
      params.billingIntervalCount,
    );

    this.amount = this.toNullableNumber(params.amount);
    this.currency = this.toNullableString(params.currency);

    this.trialDays = this.toNullableNumber(params.trialDays);
    this.maxBillingCycles = this.toNullableNumber(params.maxBillingCycles);

    this.gatewayPlanId = this.toNullableString(params.gatewayPlanId);

    this.paymentMethods = Array.isArray(params.paymentMethods)
      ? params.paymentMethods.map((item) => String(item).trim()).filter(Boolean)
      : null;

    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    this.status = this.toNullableString(params.status);
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      throw new Error(`invalid number value: ${String(value)}`);
    }

    return numberValue;
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('metadata/config must be an object');
    }

    return value as Record<string, unknown>;
  }
}