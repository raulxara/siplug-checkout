export class GetAllPaymentSplitsByPaymentTransactionIdDtoOut {
  constructor(public readonly paymentSplits: Array<Record<string, unknown>>) {}
}
