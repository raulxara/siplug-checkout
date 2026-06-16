export class GetMercadoPagoPaymentDtoIn {
  public readonly paymentId: string;
  public readonly accessToken: string;

  constructor(params: { paymentId?: unknown; accessToken?: unknown }) {
    this.paymentId = String(params.paymentId ?? '').trim();
    this.accessToken = String(params.accessToken ?? '').trim();

    if (this.paymentId === '') {
      throw new Error('paymentId is required');
    }

    if (this.accessToken === '') {
      throw new Error('accessToken is required');
    }
  }
}