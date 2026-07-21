import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class NormalizePicPayWebhookDtoOut {
  constructor(
    public readonly normalizedEvent: NormalizedPaymentWebhookEventDto,
  ) {}
}
