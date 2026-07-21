export class GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn {
  public readonly checkoutSessionId: string;

  constructor(checkoutSessionId: string) {
    this.checkoutSessionId = checkoutSessionId;

    if (this.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }
  }
}