export class UpdateSplitRuleRecipientDtoIn {
  constructor(
    public readonly _id: string,

    public readonly splitRuleId: string | null,
    public readonly splitRecipientId: string | null,

    public readonly role: string | null,
    public readonly percentage: number | null,
    public readonly fixedAmount: number | null,
    public readonly liableForGatewayFee: boolean | null,
    public readonly liableForRefund: boolean | null,
    public readonly priority: number | null,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string | null,
    public readonly source: string,
  ) {}
}
