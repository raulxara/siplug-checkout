"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSubscriptionWebhookEventDtoIn = void 0;
const normalized_payment_webhook_event_dto_1 = require("../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
class ProcessSubscriptionWebhookEventDtoIn {
    paymentWebhookEventId;
    normalizedEvent;
    paymentTransaction;
    paymentProcessingResult;
    constructor(params) {
        this.paymentWebhookEventId = String(params.paymentWebhookEventId ?? '').trim();
        if (this.paymentWebhookEventId === '') {
            throw new Error('paymentWebhookEventId is required');
        }
        if (params.normalizedEvent instanceof normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto) {
            this.normalizedEvent = params.normalizedEvent;
        }
        else {
            if (!params.normalizedEvent ||
                typeof params.normalizedEvent !== 'object' ||
                Array.isArray(params.normalizedEvent)) {
                throw new Error('normalizedEvent is required');
            }
            this.normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto(params.normalizedEvent);
        }
        this.paymentTransaction = params.paymentTransaction ?? null;
        this.paymentProcessingResult = params.paymentProcessingResult ?? null;
    }
}
exports.ProcessSubscriptionWebhookEventDtoIn = ProcessSubscriptionWebhookEventDtoIn;
//# sourceMappingURL=process-subscription-webhook-event.dto-in.js.map