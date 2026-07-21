"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateStripeWebhookDtoIn = void 0;
class ValidateStripeWebhookDtoIn {
    rawBody;
    stripeSignature;
    endpointSecret;
    toleranceInSeconds;
    constructor(params) {
        this.rawBody = String(params.rawBody ?? '');
        this.stripeSignature = String(params.stripeSignature ?? '').trim();
        this.endpointSecret = String(params.endpointSecret ?? '').trim();
        this.toleranceInSeconds = Number(params.toleranceInSeconds ?? 300);
        if (this.rawBody === '') {
            throw new Error('rawBody is required for Stripe webhook validation');
        }
        if (this.stripeSignature === '') {
            throw new Error('Stripe-Signature header is required');
        }
        if (this.endpointSecret === '') {
            throw new Error('STRIPE_WEBHOOK_SECRET is required');
        }
        if (Number.isNaN(this.toleranceInSeconds) ||
            this.toleranceInSeconds <= 0) {
            throw new Error('toleranceInSeconds must be greater than zero');
        }
    }
}
exports.ValidateStripeWebhookDtoIn = ValidateStripeWebhookDtoIn;
//# sourceMappingURL=validate-stripe-webhook.dto-in.js.map