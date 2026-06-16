"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveStripeWebhookDtoOut = void 0;
class ReceiveStripeWebhookDtoOut {
    paymentWebhookEvent;
    paymentTransaction;
    processingResult;
    wasAlreadyRegistered;
    constructor(paymentWebhookEvent, paymentTransaction, processingResult, wasAlreadyRegistered) {
        this.paymentWebhookEvent = paymentWebhookEvent;
        this.paymentTransaction = paymentTransaction;
        this.processingResult = processingResult;
        this.wasAlreadyRegistered = wasAlreadyRegistered;
    }
}
exports.ReceiveStripeWebhookDtoOut = ReceiveStripeWebhookDtoOut;
//# sourceMappingURL=receive-stripe-webhook.dto-out.js.map