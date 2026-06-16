"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookEventDtoIn = void 0;
const normalized_payment_webhook_event_dto_1 = require("../../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
class ProcessPaymentWebhookEventDtoIn {
    paymentWebhookEventId;
    normalizedEvent;
    constructor(params) {
        this.paymentWebhookEventId = String(params.paymentWebhookEventId ?? '').trim();
        if (this.paymentWebhookEventId === '') {
            throw new Error('paymentWebhookEventId is required');
        }
        if (params.normalizedEvent instanceof normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto) {
            this.normalizedEvent = params.normalizedEvent;
            return;
        }
        if (!params.normalizedEvent ||
            typeof params.normalizedEvent !== 'object' ||
            Array.isArray(params.normalizedEvent)) {
            throw new Error('normalizedEvent is required');
        }
        this.normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto(params.normalizedEvent);
    }
}
exports.ProcessPaymentWebhookEventDtoIn = ProcessPaymentWebhookEventDtoIn;
//# sourceMappingURL=process-payment-webhook-event.dto-in.js.map