export class CreateSplitRuleDtoIn {
  constructor(
    public readonly officeId: string,
    public readonly clientId: string,
    public readonly gatewayId: string | null,

    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly splitType: string,
    public readonly calculationBase: string,
    public readonly priority: number,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
