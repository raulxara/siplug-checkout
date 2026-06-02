export class SyncPaymentTransactionStatusDtoIn {
  public readonly token: string;
  public readonly paymentTransactionId: string;
  public readonly force: boolean;

  constructor(params: {
    token: string;
    paymentTransactionId: string;
    force?: boolean | null;
  }) {
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
    this.force = Boolean(params.force);
  }
}
