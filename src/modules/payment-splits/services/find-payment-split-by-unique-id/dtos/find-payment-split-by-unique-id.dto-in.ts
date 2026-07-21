export class FindPaymentSplitByUniqueIdDtoIn {
  public readonly paymentSplitId: string;

  constructor(paymentSplitId: unknown) {
    this.paymentSplitId = String(paymentSplitId ?? '').trim();

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }
  }
}
