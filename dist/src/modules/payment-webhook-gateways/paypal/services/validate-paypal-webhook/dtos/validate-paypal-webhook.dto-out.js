"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePayPalWebhookDtoOut = void 0;
class ValidatePayPalWebhookDtoOut {
    valid;
    skipped;
    reason;
    providerResponse;
    constructor(valid, skipped, reason, providerResponse) {
        this.valid = valid;
        this.skipped = skipped;
        this.reason = reason;
        this.providerResponse = providerResponse;
    }
}
exports.ValidatePayPalWebhookDtoOut = ValidatePayPalWebhookDtoOut;
//# sourceMappingURL=validate-paypal-webhook.dto-out.js.map