"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkPaymentWebhookEventAsFailedDtoIn = void 0;
class MarkPaymentWebhookEventAsFailedDtoIn {
    _id;
    errorMessage;
    processingResult;
    source;
    constructor(params) {
        this._id = String(params._id ?? '').trim();
        this.errorMessage = String(params.errorMessage ?? '').trim();
        this.processingResult = this.toObject(params.processingResult);
        this.source = String(params.source ?? 'system').trim();
        if (this._id === '') {
            throw new Error('_id is required');
        }
        if (this.errorMessage === '') {
            throw new Error('errorMessage is required');
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
exports.MarkPaymentWebhookEventAsFailedDtoIn = MarkPaymentWebhookEventAsFailedDtoIn;
//# sourceMappingURL=mark-payment-webhook-event-as-failed.dto-in.js.map