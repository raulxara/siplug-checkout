export class CreateSubscriptionDtoIn {
  constructor(
    public readonly officeId: string,
    public readonly clientId: string,

    public readonly subscriptionPlanId: string | null,
    public readonly paymentCustomerId: string,

    public readonly gatewayId: string | null,
    public readonly apiCredentialId: string | null,

    public readonly gatewaySubscriptionId: string | null,
    public readonly externalReference: string | null,

    public readonly amount: number,
    public readonly currency: string,

    public readonly currentCycle: number,

    public readonly nextBillingAt: string | null,
    public readonly startedAt: string | null,
    public readonly canceledAt: string | null,
    public readonly endedAt: string | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}