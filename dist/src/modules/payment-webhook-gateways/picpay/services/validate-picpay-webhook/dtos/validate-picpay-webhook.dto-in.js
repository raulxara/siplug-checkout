"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePicPayWebhookDtoIn = void 0;
class ValidatePicPayWebhookDtoIn {
    authorization;
    webhookToken;
    authMode;
    constructor(params) {
        this.authorization = this.toNullableString(params.authorization);
        this.webhookToken = this.toNullableString(params.webhookToken);
        const mode = String(params.authMode ?? 'required').trim();
        this.authMode = mode === 'optional' ? 'optional' : 'required';
        if (this.authMode === 'required' && this.webhookToken === null) {
            throw new Error('PicPay webhookToken is required when auth mode is required');
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
exports.ValidatePicPayWebhookDtoIn = ValidatePicPayWebhookDtoIn;
//# sourceMappingURL=validate-picpay-webhook.dto-in.js.map