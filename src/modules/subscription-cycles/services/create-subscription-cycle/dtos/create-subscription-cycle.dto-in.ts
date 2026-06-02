export class CreateSubscriptionCycleDtoIn {
  constructor(
    public readonly subscriptionId: string,
    public readonly cycleNumber: number,

    public readonly amount: number,
    public readonly currency: string,

    public readonly periodStart: string | null,
    public readonly periodEnd: string | null,
    public readonly scheduledAt: string | null,
    public readonly processedAt: string | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}