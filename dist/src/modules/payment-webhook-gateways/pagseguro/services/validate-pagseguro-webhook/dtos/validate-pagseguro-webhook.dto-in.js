"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePagSeguroWebhookDtoIn = void 0;
class ValidatePagSeguroWebhookDtoIn {
    rawBody;
    token;
    xAuthenticityToken;
    signatureMode;
    constructor(params) {
        this.rawBody = String(params.rawBody ?? '');
        this.token = String(params.token ?? '').trim();
        this.xAuthenticityToken = this.toNullableString(params.xAuthenticityToken);
        const mode = String(params.signatureMode ?? 'required').trim();
        this.signatureMode = mode === 'optional' ? 'optional' : 'required';
        if (this.rawBody === '') {
            throw new Error('rawBody is required');
        }
        if (this.token === '') {
            throw new Error('PagSeguro token is required');
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
exports.ValidatePagSeguroWebhookDtoIn = ValidatePagSeguroWebhookDtoIn;
//# sourceMappingURL=validate-pagseguro-webhook.dto-in.js.map