export class MarkPaymentWebhookEventAsProcessingDtoOut {
  constructor(public readonly paymentWebhookEvent: Record<string, unknown>) {}
}
