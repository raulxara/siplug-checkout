import { NormalizedPaymentWebhookEventDto } from '../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
export declare class ProcessSubscriptionWebhookEventDtoIn {
    readonly paymentWebhookEventId: string;
    readonly normalizedEvent: NormalizedPaymentWebhookEventDto;
    readonly paymentTransaction: Record<string, unknown> | null;
    readonly paymentProcessingResult: Record<string, unknown> | null;
    constructor(params: {
        paymentWebhookEventId?: unknown;
        normalizedEvent?: NormalizedPaymentWebhookEventDto | Record<string, unknown>;
        paymentTransaction?: Record<string, unknown> | null;
        paymentProcessingResult?: Record<string, unknown> | null;
    });
}
