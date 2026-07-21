export class GetPaymentTransactionByUniqueIdDtoIn {
  public readonly token: string;
  public readonly paymentTransactionId: string;

  constructor(params: { token: string; paymentTransactionId: string }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (
      !params.paymentTransactionId ||
      params.paymentTransactionId.trim() === ''
    ) {
      throw new Error('paymentTransactionId is required');
    }

    this.token = params.token.trim();
    this.paymentTransactionId = params.paymentTransactionId.trim();
  }
}
