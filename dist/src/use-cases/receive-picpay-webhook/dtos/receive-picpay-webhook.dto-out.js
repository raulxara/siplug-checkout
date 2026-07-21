"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePicPayWebhookDtoOut = void 0;
class ReceivePicPayWebhookDtoOut {
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
exports.ReceivePicPayWebhookDtoOut = ReceivePicPayWebhookDtoOut;
//# sourceMappingURL=receive-picpay-webhook.dto-out.js.map