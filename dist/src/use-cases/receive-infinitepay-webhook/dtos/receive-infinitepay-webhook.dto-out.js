"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveInfinitePayWebhookDtoOut = void 0;
class ReceiveInfinitePayWebhookDtoOut {
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
exports.ReceiveInfinitePayWebhookDtoOut = ReceiveInfinitePayWebhookDtoOut;
//# sourceMappingURL=receive-infinitepay-webhook.dto-out.js.map