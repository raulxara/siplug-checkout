"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMercadoPagoWebhookDtoIn = void 0;
class ValidateMercadoPagoWebhookDtoIn {
    xSignature;
    xRequestId;
    dataId;
    webhookSecret;
    constructor(params) {
        this.xSignature = String(params.xSignature ?? '').trim();
        this.xRequestId = String(params.xRequestId ?? '').trim();
        this.dataId = this.toNullableString(params.dataId)?.toLowerCase() ?? null;
        this.webhookSecret = String(params.webhookSecret ?? '').trim();
        if (this.xSignature === '') {
            throw new Error('x-signature header is required');
        }
        if (this.xRequestId === '') {
            throw new Error('x-request-id header is required');
        }
        if (this.webhookSecret === '') {
            throw new Error('Mercado Pago webhookSecret is required');
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.ValidateMercadoPagoWebhookDtoIn = ValidateMercadoPagoWebhookDtoIn;
//# sourceMappingURL=validate-mercado-pago-webhook.dto-in.js.map