export class ProcessPaymentWebhookEventDtoOut {
  constructor(
    public readonly paymentWebhookEvent: Record<string, unknown>,
    public readonly paymentTransaction: Record<string, unknown> | null,
    public readonly transactionUpdated: boolean,
    public readonly splitDispatchRequired: boolean,
    public readonly processingResult: Record<string, unknown>,
  ) {}
}
