export class ListPaymentSplitsByOfficeIdDtoOut {
  constructor(
    public readonly paymentSplits: Array<{
      paymentSplit: Record<string, unknown>;
      paymentSplitRecipients: Array<Record<string, unknown>>;
    }>,
  ) {}
}
