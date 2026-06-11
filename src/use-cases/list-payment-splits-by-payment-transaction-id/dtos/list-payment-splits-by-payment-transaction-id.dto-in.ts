export class ListPaymentSplitsByPaymentTransactionIdDtoIn {
  public readonly token: string;
  public readonly paymentTransactionId: string;

  constructor(params: { token?: unknown; paymentTransactionId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.paymentTransactionId = String(
      params.paymentTransactionId ?? '',
    ).trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.paymentTransactionId === '') {
      throw new Error('paymentTransactionId is required');
    }
  }
}
