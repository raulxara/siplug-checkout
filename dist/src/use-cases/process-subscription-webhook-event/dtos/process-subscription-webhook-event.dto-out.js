"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSubscriptionWebhookEventDtoOut = void 0;
class ProcessSubscriptionWebhookEventDtoOut {
    paymentWebhookEvent;
    paymentTransaction;
    subscription;
    subscriptionCycle;
    subscriptionInvoice;
    subscriptionUpdated;
    subscriptionCycleUpdated;
    subscriptionInvoiceUpdated;
    processingResult;
    constructor(paymentWebhookEvent, paymentTransaction, subscription, subscriptionCycle, subscriptionInvoice, subscriptionUpdated, subscriptionCycleUpdated, subscriptionInvoiceUpdated, processingResult) {
        this.paymentWebhookEvent = paymentWebhookEvent;
        this.paymentTransaction = paymentTransaction;
        this.subscription = subscription;
        this.subscriptionCycle = subscriptionCycle;
        this.subscriptionInvoice = subscriptionInvoice;
        this.subscriptionUpdated = subscriptionUpdated;
        this.subscriptionCycleUpdated = subscriptionCycleUpdated;
        this.subscriptionInvoiceUpdated = subscriptionInvoiceUpdated;
        this.processingResult = processingResult;
    }
}
exports.ProcessSubscriptionWebhookEventDtoOut = ProcessSubscriptionWebhookEventDtoOut;
//# sourceMappingURL=process-subscription-webhook-event.dto-out.js.map