"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeMercadoPagoWebhookDtoIn = void 0;
class NormalizeMercadoPagoWebhookDtoIn {
    payload;
    payment;
    preapproval;
    headers;
    queryParams;
    constructor(params) {
        this.payload = this.toObject(params.payload, 'payload');
        this.payment = this.toNullableObject(params.payment, 'payment');
        this.preapproval = this.toNullableObject(params.preapproval, 'preapproval');
        this.headers = this.toObject(params.headers, 'headers');
        this.queryParams = this.toObject(params.queryParams, 'queryParams');
        if (this.payment === null && this.preapproval === null) {
            throw new Error('payment or preapproval is required');
        }
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
    toNullableObject(value, field) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.NormalizeMercadoPagoWebhookDtoIn = NormalizeMercadoPagoWebhookDtoIn;
//# sourceMappingURL=normalize-mercado-pago-webhook.dto-in.js.map