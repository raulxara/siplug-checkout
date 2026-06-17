import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class NormalizePagSeguroWebhookDtoOut {
  constructor(
    public readonly normalizedEvent: NormalizedPaymentWebhookEventDto,
  ) {}
}
