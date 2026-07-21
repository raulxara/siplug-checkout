export class GetPaymentSplitByUniqueIdDtoIn {
  public readonly token: string;
  public readonly paymentSplitId: string;

  constructor(params: { token?: unknown; paymentSplitId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }
  }
}
