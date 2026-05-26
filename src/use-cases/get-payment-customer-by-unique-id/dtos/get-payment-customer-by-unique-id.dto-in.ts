export class GetPaymentCustomerByUniqueIdDtoIn {
  public readonly token: string;
  public readonly paymentCustomerId: string;

  constructor(params: { token?: string; paymentCustomerId?: string }) {
    this.token = params.token ?? '';
    this.paymentCustomerId = params.paymentCustomerId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.paymentCustomerId.trim() === '') {
      throw new Error('paymentCustomerId is required');
    }
  }
}