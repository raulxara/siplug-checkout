export class FindUserCustomerByTokenDtoIn {
  public readonly token: string;

  constructor(token: string) {
    this.token = token;

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }
  }
}