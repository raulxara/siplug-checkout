"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveStripeWebhookDtoIn = void 0;
class ReceiveStripeWebhookDtoIn {
    apiCredentialId;
    rawBody;
    payload;
    headers;
    stripeSignature;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.rawBody = String(params.rawBody ?? '');
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        this.stripeSignature = String(params.stripeSignature ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.rawBody === '') {
            throw new Error('rawBody is required');
        }
        if (this.stripeSignature === '') {
            throw new Error('stripeSignature is required');
        }
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.ReceiveStripeWebhookDtoIn = ReceiveStripeWebhookDtoIn;
//# sourceMappingURL=receive-stripe-webhook.dto-in.js.map