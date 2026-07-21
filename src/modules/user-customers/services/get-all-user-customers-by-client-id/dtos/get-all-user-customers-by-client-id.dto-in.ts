export class GetAllUserCustomersByClientIdDtoIn {
  public readonly clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }
  }
}