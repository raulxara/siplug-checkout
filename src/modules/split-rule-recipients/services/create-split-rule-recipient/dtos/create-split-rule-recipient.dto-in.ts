export class CreateSplitRuleRecipientDtoIn {
  constructor(
    public readonly splitRuleId: string,
    public readonly splitRecipientId: string,

    public readonly role: string,
    public readonly percentage: number | null,
    public readonly fixedAmount: number | null,
    public readonly liableForGatewayFee: boolean,
    public readonly liableForRefund: boolean,
    public readonly priority: number,

    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,

    public readonly status: string,
  ) {}
}
