export class ProcessSubscriptionWebhookEventDtoOut {
  constructor(
    public readonly paymentWebhookEvent: Record<string, unknown>,
    public readonly paymentTransaction: Record<string, unknown> | null,
    public readonly subscription: Record<string, unknown> | null,
    public readonly subscriptionCycle: Record<string, unknown> | null,
    public readonly subscriptionInvoice: Record<string, unknown> | null,
    public readonly subscriptionUpdated: boolean,
    public readonly subscriptionCycleUpdated: boolean,
    public readonly subscriptionInvoiceUpdated: boolean,
    public readonly processingResult: Record<string, unknown>,
  ) {}
}
