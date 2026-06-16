export class MarkPaymentWebhookEventAsProcessedDtoOut {
  constructor(public readonly paymentWebhookEvent: Record<string, unknown>) {}
}
