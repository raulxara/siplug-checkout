export class CalculatePaymentSplitDtoIn {
  constructor(
    public readonly splitRuleId: string,
    public readonly grossAmount: number,
    public readonly gatewayFeeAmount: number | null,
    public readonly netAmount: number | null,
    public readonly currency: string,
    public readonly metadata: Record<string, unknown> | null,
  ) {}
}
