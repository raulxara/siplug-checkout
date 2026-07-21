export class UpdateSplitRuleDtoIn {
  constructor(
    public readonly _id: string,

    public readonly officeId: string | null,
    public readonly clientId: string | null,
    public readonly gatewayId: string | null,

    public readonly name: string | null,
    public readonly slug: string | null,
    public readonly description: string | null,
    public readonly splitType: string | null,
    public readonly calculationBase: string | null,
    public readonly priority: number | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string | null,
    public readonly source: string,
  ) {}
}
