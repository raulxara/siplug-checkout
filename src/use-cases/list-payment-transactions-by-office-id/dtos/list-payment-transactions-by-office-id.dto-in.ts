export class ListPaymentTransactionsByOfficeIdDtoIn {
  public readonly token: string;
  public readonly officeId: string;

  constructor(params: { token: string; officeId: string }) {
    if (!params.token || params.token.trim() === '') {
      throw new Error('token is required');
    }

    if (!params.officeId || params.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    this.token = params.token.trim();
    this.officeId = params.officeId.trim();
  }
}
