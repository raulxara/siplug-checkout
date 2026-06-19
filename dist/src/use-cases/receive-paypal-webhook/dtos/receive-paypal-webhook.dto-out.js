"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePayPalWebhookDtoOut = void 0;
class ReceivePayPalWebhookDtoOut {
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
exports.ReceivePayPalWebhookDtoOut = ReceivePayPalWebhookDtoOut;
//# sourceMappingURL=receive-paypal-webhook.dto-out.js.map