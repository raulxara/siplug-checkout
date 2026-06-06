export class UpdateSubscriptionPlanDtoIn {
  public readonly _id: string;

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
  public readonly source: string;

  constructor(params: {
    _id: string;

    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    apiCredentialId?: string | null;

    name?: string | null;
    slug?: string | null;
    description?: string | null;

    billingInterval?: string | null;
    billingIntervalCount?: number | null;

    amount?: number | null;
    currency?: string | null;

    trialDays?: number | null;
    maxBillingCycles?: number | null;

    gatewayPlanId?: string | null;
    paymentMethods?: string[] | null;

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string | null;
    source: string;
  }) {
    this._id = params._id;

    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.description = params.description ?? null;

    this.billingInterval = params.billingInterval ?? null;
    this.billingIntervalCount = params.billingIntervalCount ?? null;

    this.amount = params.amount ?? null;
    this.currency = params.currency ?? null;

    this.trialDays = params.trialDays ?? null;
    this.maxBillingCycles = params.maxBillingCycles ?? null;

    this.gatewayPlanId = params.gatewayPlanId ?? null;
    this.paymentMethods = params.paymentMethods ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? null;
    this.source = params.source;
  }
}