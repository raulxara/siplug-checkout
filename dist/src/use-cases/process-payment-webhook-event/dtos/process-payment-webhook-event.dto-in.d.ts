import { NormalizedPaymentWebhookEventDto } from '../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
export declare class ProcessPaymentWebhookEventDtoIn {
    readonly paymentWebhookEventId: string;
    readonly normalizedEvent: NormalizedPaymentWebhookEventDto;
    constructor(params: {
        paymentWebhookEventId?: unknown;
        normalizedEvent?: NormalizedPaymentWebhookEventDto | Record<string, unknown>;
    });
}
