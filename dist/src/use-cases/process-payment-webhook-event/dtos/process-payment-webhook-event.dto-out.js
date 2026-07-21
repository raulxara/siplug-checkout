"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentWebhookEventDtoOut = void 0;
class ProcessPaymentWebhookEventDtoOut {
    paymentWebhookEvent;
    paymentTransaction;
    transactionUpdated;
    splitDispatchRequired;
    processingResult;
    constructor(paymentWebhookEvent, paymentTransaction, transactionUpdated, splitDispatchRequired, processingResult) {
        this.paymentWebhookEvent = paymentWebhookEvent;
        this.paymentTransaction = paymentTransaction;
        this.transactionUpdated = transactionUpdated;
        this.splitDispatchRequired = splitDispatchRequired;
        this.processingResult = processingResult;
    }
}
exports.ProcessPaymentWebhookEventDtoOut = ProcessPaymentWebhookEventDtoOut;
//# sourceMappingURL=process-payment-webhook-event.dto-out.js.map