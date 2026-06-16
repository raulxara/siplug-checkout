"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMercadoPagoWebhookDtoIn = void 0;
class ReceiveMercadoPagoWebhookDtoIn {
    apiCredentialId;
    payload;
    headers;
    queryParams;
    xSignature;
    xRequestId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.payload = this.toObject(params.payload, 'payload');
        this.headers = this.toObject(params.headers, 'headers');
        this.queryParams = this.toObject(params.queryParams, 'queryParams');
        this.xSignature = String(params.xSignature ?? '').trim();
        this.xRequestId = String(params.xRequestId ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.xSignature === '') {
            throw new Error('x-signature is required');
        }
        if (this.xRequestId === '') {
            throw new Error('x-request-id is required');
        }
    }
    toObject(value, field) {
        if (value === undefined || value === null) {
            return {};
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.ReceiveMercadoPagoWebhookDtoIn = ReceiveMercadoPagoWebhookDtoIn;
//# sourceMappingURL=receive-mercado-pago-webhook.dto-in.js.map