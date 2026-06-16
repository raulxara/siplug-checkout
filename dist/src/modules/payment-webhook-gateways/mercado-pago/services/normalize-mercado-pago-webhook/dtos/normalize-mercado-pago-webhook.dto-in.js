"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeMercadoPagoWebhookDtoIn = void 0;
class NormalizeMercadoPagoWebhookDtoIn {
    payload;
    payment;
    headers;
    queryParams;
    constructor(params) {
        this.payload = this.toObject(params.payload, 'payload');
        this.payment = this.toObject(params.payment, 'payment');
        this.headers = this.toObject(params.headers, 'headers');
        this.queryParams = this.toObject(params.queryParams, 'queryParams');
    }
    toObject(value, field) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`${field} must be an object`);
        }
        return value;
    }
}
exports.NormalizeMercadoPagoWebhookDtoIn = NormalizeMercadoPagoWebhookDtoIn;
//# sourceMappingURL=normalize-mercado-pago-webhook.dto-in.js.map