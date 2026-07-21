"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkPaymentWebhookEventAsProcessingDtoIn = void 0;
class MarkPaymentWebhookEventAsProcessingDtoIn {
    _id;
    source;
    constructor(params) {
        this._id = String(params._id ?? '').trim();
        this.source = String(params.source ?? 'MarkPaymentWebhookEventAsProcessingService').trim();
        if (this._id === '') {
            throw new Error('_id is required');
        }
    }
}
exports.MarkPaymentWebhookEventAsProcessingDtoIn = MarkPaymentWebhookEventAsProcessingDtoIn;
//# sourceMappingURL=mark-payment-webhook-event-as-processing.dto-in.js.map