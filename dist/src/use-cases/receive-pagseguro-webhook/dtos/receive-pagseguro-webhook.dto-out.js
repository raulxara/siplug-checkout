"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePagSeguroWebhookDtoOut = void 0;
class ReceivePagSeguroWebhookDtoOut {
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
exports.ReceivePagSeguroWebhookDtoOut = ReceivePagSeguroWebhookDtoOut;
//# sourceMappingURL=receive-pagseguro-webhook.dto-out.js.map