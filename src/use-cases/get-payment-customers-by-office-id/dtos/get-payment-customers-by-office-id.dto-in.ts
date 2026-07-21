export class GetPaymentCustomersByOfficeIdDtoIn {
  public readonly token: string;
  public readonly officeId: string;

  constructor(params: { token?: string; officeId?: string }) {
    this.token = params.token ?? '';
    this.officeId = params.officeId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }
  }
}