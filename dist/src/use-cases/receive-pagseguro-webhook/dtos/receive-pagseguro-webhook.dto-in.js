"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePagSeguroWebhookDtoIn = void 0;
class ReceivePagSeguroWebhookDtoIn {
    apiCredentialId;
    payload;
    rawBody;
    headers;
    xAuthenticityToken;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.payload = this.toObject(params.payload, 'payload');
        this.rawBody = String(params.rawBody ?? '').trim();
        this.headers = this.toObject(params.headers, 'headers');
        this.xAuthenticityToken = this.toNullableString(params.xAuthenticityToken);
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.rawBody === '') {
            throw new Error('rawBody is required for PagSeguro webhook validation');
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
exports.ReceivePagSeguroWebhookDtoIn = ReceivePagSeguroWebhookDtoIn;
//# sourceMappingURL=receive-pagseguro-webhook.dto-in.js.map