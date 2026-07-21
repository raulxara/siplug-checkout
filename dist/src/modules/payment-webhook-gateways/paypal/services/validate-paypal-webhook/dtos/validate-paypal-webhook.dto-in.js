"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePayPalWebhookDtoIn = void 0;
class ValidatePayPalWebhookDtoIn {
    baseUrl;
    accessToken;
    webhookId;
    authMode;
    payload;
    headers;
    constructor(params) {
        this.baseUrl = String(params.baseUrl ?? '').trim().replace(/\/+$/, '');
        this.accessToken = String(params.accessToken ?? '').trim();
        this.webhookId = this.toNullableString(params.webhookId);
        this.authMode = String(params.authMode ?? 'required').trim().toLowerCase();
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        if (this.baseUrl === '') {
            throw new Error('baseUrl is required');
        }
        if (this.accessToken === '') {
            throw new Error('accessToken is required');
        }
        if (!['required', 'optional'].includes(this.authMode)) {
            throw new Error('authMode must be required or optional');
        }
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.ValidatePayPalWebhookDtoIn = ValidatePayPalWebhookDtoIn;
//# sourceMappingURL=validate-paypal-webhook.dto-in.js.map