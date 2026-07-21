import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class NormalizeInfinitePayWebhookDtoOut {
  constructor(
    public readonly normalizedEvent: NormalizedPaymentWebhookEventDto,
  ) {}
}
