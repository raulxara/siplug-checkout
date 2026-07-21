export class GetCheckoutSessionByUniqueIdDtoIn {
  public readonly token: string;
  public readonly checkoutSessionId: string;

  constructor(params: { token?: string; checkoutSessionId?: string }) {
    this.token = params.token ?? '';
    this.checkoutSessionId = params.checkoutSessionId ?? '';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }
  }
}