import { NormalizedPaymentWebhookEventDto } from '../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

export class ProcessSubscriptionWebhookEventDtoIn {
  public readonly paymentWebhookEventId: string;
  public readonly normalizedEvent: NormalizedPaymentWebhookEventDto;
  public readonly paymentTransaction: Record<string, unknown> | null;
  public readonly paymentProcessingResult: Record<string, unknown> | null;

  constructor(params: {
    paymentWebhookEventId?: unknown;
    normalizedEvent?: NormalizedPaymentWebhookEventDto | Record<string, unknown>;
    paymentTransaction?: Record<string, unknown> | null;
    paymentProcessingResult?: Record<string, unknown> | null;
  }) {
    this.paymentWebhookEventId = String(
      params.paymentWebhookEventId ?? '',
    ).trim();

    if (this.paymentWebhookEventId === '') {
      throw new Error('paymentWebhookEventId is required');
    }

    if (params.normalizedEvent instanceof NormalizedPaymentWebhookEventDto) {
      this.normalizedEvent = params.normalizedEvent;
    } else {
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

    this.paymentTransaction = params.paymentTransaction ?? null;
    this.paymentProcessingResult = params.paymentProcessingResult ?? null;
  }
}
