import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
export declare class NormalizeStripeWebhookDtoOut {
    readonly normalizedEvent: NormalizedPaymentWebhookEventDto;
    constructor(normalizedEvent: NormalizedPaymentWebhookEventDto);
}
