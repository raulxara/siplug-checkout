export class GetAllPaymentSplitsByOfficeIdDtoOut {
  constructor(public readonly paymentSplits: Array<Record<string, unknown>>) {}
}
