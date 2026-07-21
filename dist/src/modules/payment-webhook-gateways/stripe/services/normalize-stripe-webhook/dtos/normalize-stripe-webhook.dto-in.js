"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeStripeWebhookDtoIn = void 0;
class NormalizeStripeWebhookDtoIn {
    payload;
    headers;
    constructor(params) {
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.NormalizeStripeWebhookDtoIn = NormalizeStripeWebhookDtoIn;
//# sourceMappingURL=normalize-stripe-webhook.dto-in.js.map