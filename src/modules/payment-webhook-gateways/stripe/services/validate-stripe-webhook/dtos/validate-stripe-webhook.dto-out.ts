export class ValidateStripeWebhookDtoOut {
  constructor(
    public readonly valid: boolean,
    public readonly timestamp: number,
  ) {}
}
