export class MarkPaymentWebhookEventAsFailedDtoOut {
  constructor(public readonly paymentWebhookEvent: Record<string, unknown>) {}
}
