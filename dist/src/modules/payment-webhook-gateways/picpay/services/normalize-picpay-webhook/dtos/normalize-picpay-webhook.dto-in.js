"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizePicPayWebhookDtoIn = void 0;
class NormalizePicPayWebhookDtoIn {
    payload;
    headers;
    eventTypeHeader;
    constructor(params) {
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        this.eventTypeHeader = this.toNullableString(params.eventTypeHeader);
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
exports.NormalizePicPayWebhookDtoIn = NormalizePicPayWebhookDtoIn;
//# sourceMappingURL=normalize-picpay-webhook.dto-in.js.map