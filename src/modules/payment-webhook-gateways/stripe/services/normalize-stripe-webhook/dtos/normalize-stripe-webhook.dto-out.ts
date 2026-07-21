import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class NormalizeStripeWebhookDtoOut {
  constructor(
    public readonly normalizedEvent: NormalizedPaymentWebhookEventDto,
  ) {}
}
