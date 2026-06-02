export class ListPaymentTransactionsDtoIn {
  public readonly token: string;

  constructor(params: { token: string }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    this.token = params.token.trim();
  }
}
