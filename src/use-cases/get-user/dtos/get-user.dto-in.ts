export class GetUserDtoIn {
  public readonly token: string;
  public readonly userCustomerId: string;

  constructor(params: { token?: string; userCustomerId?: string }) {
    this.token = params.token ?? '';
    this.userCustomerId = params.userCustomerId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }
  }
}