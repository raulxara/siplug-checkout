export class GetAllPaymentSplitsByPaymentTransactionIdDtoIn {
  public readonly paymentTransactionId: string;

  constructor(paymentTransactionId: unknown) {
    this.paymentTransactionId = String(paymentTransactionId ?? '').trim();

    if (this.paymentTransactionId === '') {
      throw new Error('paymentTransactionId is required');
    }
  }
}
