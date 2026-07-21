"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePayPalWebhookDtoIn = void 0;
class ReceivePayPalWebhookDtoIn {
    apiCredentialId;
    payload;
    headers;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.ReceivePayPalWebhookDtoIn = ReceivePayPalWebhookDtoIn;
//# sourceMappingURL=receive-paypal-webhook.dto-in.js.map