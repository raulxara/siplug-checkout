export class ResolvePaymentSplitDispatchEligibilityDtoOut {
  constructor(
    public readonly eligible: boolean,
    public readonly reason: string,
    public readonly paymentSplitId: string,
    public readonly currentStatus: string | null,
    public readonly paymentSplit: Record<string, unknown> | null,
  ) {}
}
