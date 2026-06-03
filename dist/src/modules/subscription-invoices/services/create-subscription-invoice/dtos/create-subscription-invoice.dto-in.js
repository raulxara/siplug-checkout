"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionInvoiceDtoIn = void 0;
class CreateSubscriptionInvoiceDtoIn {
    subscriptionId;
    subscriptionCycleId;
    paymentTransactionId;
    invoiceNumber;
    amount;
    currency;
    dueAt;
    paidAt;
    attemptNumber;
    externalReference;
    gatewayInvoiceId;
    lastAttemptAt;
    metadata;
    config;
    status;
    constructor(subscriptionId, subscriptionCycleId, paymentTransactionId, invoiceNumber, amount, currency, dueAt, paidAt, attemptNumber, externalReference, gatewayInvoiceId, lastAttemptAt, metadata, config, status) {
        this.subscriptionId = subscriptionId;
        this.subscriptionCycleId = subscriptionCycleId;
        this.paymentTransactionId = paymentTransactionId;
        this.invoiceNumber = invoiceNumber;
        this.amount = amount;
        this.currency = currency;
        this.dueAt = dueAt;
        this.paidAt = paidAt;
        this.attemptNumber = attemptNumber;
        this.externalReference = externalReference;
        this.gatewayInvoiceId = gatewayInvoiceId;
        this.lastAttemptAt = lastAttemptAt;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSubscriptionInvoiceDtoIn = CreateSubscriptionInvoiceDtoIn;
//# sourceMappingURL=create-subscription-invoice.dto-in.js.map