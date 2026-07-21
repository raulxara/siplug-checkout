export class GetPaymentSplitByUniqueIdDtoOut {
  constructor(
    public readonly paymentSplit: Record<string, unknown>,
    public readonly paymentSplitRecipients: Array<Record<string, unknown>>,
  ) {}
}
