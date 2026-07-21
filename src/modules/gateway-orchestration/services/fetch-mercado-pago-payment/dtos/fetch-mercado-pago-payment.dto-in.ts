export class FetchMercadoPagoPaymentDtoIn {
  public readonly accessToken: string;
  public readonly paymentId: string;

  constructor(params: {
    accessToken: string;
    paymentId: string;
  }) {
    this.accessToken = params.accessToken;
    this.paymentId = params.paymentId;

    if (this.accessToken.trim() === '') {
      throw new Error('accessToken is required');
    }

    if (this.paymentId.trim() === '') {
      throw new Error('paymentId is required');
    }
  }
}