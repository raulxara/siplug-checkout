export class GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut {
  constructor(
    public readonly paymentSplitRecipients: Array<Record<string, unknown>>,
  ) {}
}
