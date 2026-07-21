import { NormalizedPaymentWebhookEventDto } from '../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class ProcessPaymentWebhookEventDtoIn {
  public readonly paymentWebhookEventId: string;
  public readonly normalizedEvent: NormalizedPaymentWebhookEventDto;

  constructor(params: {
    paymentWebhookEventId?: unknown;
    normalizedEvent?: NormalizedPaymentWebhookEventDto | Record<string, unknown>;
  }) {
    this.paymentWebhookEventId = String(
      params.paymentWebhookEventId ?? '',
    ).trim();

    if (this.paymentWebhookEventId === '') {
      throw new Error('paymentWebhookEventId is required');
    }

    if (params.normalizedEvent instanceof NormalizedPaymentWebhookEventDto) {
      this.normalizedEvent = params.normalizedEvent;
      return;
    }

    if (
      !params.normalizedEvent ||
      typeof params.normalizedEvent !== 'object' ||
      Array.isArray(params.normalizedEvent)
    ) {
      throw new Error('normalizedEvent is required');
    }

    this.normalizedEvent = new NormalizedPaymentWebhookEventDto(
      params.normalizedEvent,
    );
  }
}
