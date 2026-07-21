import { NormalizedPaymentWebhookEventDto } from '../../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
export declare class NormalizeInfinitePayWebhookDtoOut {
    readonly normalizedEvent: NormalizedPaymentWebhookEventDto;
    constructor(normalizedEvent: NormalizedPaymentWebhookEventDto);
}
