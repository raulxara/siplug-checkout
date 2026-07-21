"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizePayPalWebhookDtoIn = void 0;
class NormalizePayPalWebhookDtoIn {
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
exports.NormalizePayPalWebhookDtoIn = NormalizePayPalWebhookDtoIn;
//# sourceMappingURL=normalize-paypal-webhook.dto-in.js.map