export class UpdateSubscriptionDtoIn {
  constructor(
    public readonly _id: string,

    public readonly currentCycle: number | null,
    public readonly nextBillingAt: string | null,
    public readonly startedAt: string | null,
    public readonly canceledAt: string | null,
    public readonly endedAt: string | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string | null,
    public readonly source: string,

    public readonly gatewaySubscriptionId: string | null = null,
  ) {}
}
