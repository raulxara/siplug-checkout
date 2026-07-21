export class CreateSubscriptionPlanDtoIn {
  constructor(
    public readonly officeId: string,
    public readonly clientId: string,

    public readonly gatewayId: string | null,
    public readonly apiCredentialId: string | null,
    public readonly gatewayPlanId: string | null,

    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,

    public readonly billingInterval: string,
    public readonly billingIntervalCount: number,

    public readonly amount: number,
    public readonly currency: string,

    public readonly trialDays: number | null,
    public readonly maxBillingCycles: number | null,

    public readonly paymentMethods: string[] | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
