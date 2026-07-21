"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkPaymentWebhookEventAsProcessedDtoIn = void 0;
class MarkPaymentWebhookEventAsProcessedDtoIn {
    _id;
    processingResult;
    source;
    constructor(params) {
        this._id = String(params._id ?? '').trim();
        this.processingResult = this.toObject(params.processingResult);
        this.source = String(params.source ?? 'system').trim();
        if (this._id === '') {
            throw new Error('_id is required');
        }
    }
    toObject(value) {
        if (value === undefined || value === null) {
            return {};
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('processingResult must be an object');
        }
        return value;
    }
}
exports.MarkPaymentWebhookEventAsProcessedDtoIn = MarkPaymentWebhookEventAsProcessedDtoIn;
//# sourceMappingURL=mark-payment-webhook-event-as-processed.dto-in.js.map