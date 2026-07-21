"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePicPayWebhookDtoIn = void 0;
class ReceivePicPayWebhookDtoIn {
    apiCredentialId;
    payload;
    rawBody;
    headers;
    authorization;
    eventTypeHeader;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.payload = this.toObject(params.payload, 'payload');
        this.rawBody = String(params.rawBody ?? '').trim();
        this.headers = this.toObject(params.headers, 'headers');
        this.authorization = this.toNullableString(params.authorization);
        this.eventTypeHeader = this.toNullableString(params.eventTypeHeader);
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.rawBody === '') {
            throw new Error('rawBody is required for PicPay webhook');
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
exports.ReceivePicPayWebhookDtoIn = ReceivePicPayWebhookDtoIn;
//# sourceMappingURL=receive-picpay-webhook.dto-in.js.map