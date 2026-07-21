export class DispatchPaymentTransactionToGatewayDtoIn {
  public readonly token: string;
  public readonly paymentTransactionId: string;

  constructor(params: { token?: string; paymentTransactionId?: string }) {
    this.token = params.token ?? '';
    this.paymentTransactionId = params.paymentTransactionId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.paymentTransactionId.trim() === '') {
      throw new Error('paymentTransactionId is required');
    }
  }
}
