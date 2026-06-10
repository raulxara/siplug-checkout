export class CreatePaymentSplitRecipientDtoOut {
  constructor(
    public readonly paymentSplitRecipient: Record<string, unknown>,
  ) {}
}
