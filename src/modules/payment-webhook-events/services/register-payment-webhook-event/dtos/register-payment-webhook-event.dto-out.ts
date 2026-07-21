export class RegisterPaymentWebhookEventDtoOut {
  constructor(
    public readonly paymentWebhookEvent: Record<string, unknown>,
    public readonly wasAlreadyRegistered: boolean,
  ) {}
}
