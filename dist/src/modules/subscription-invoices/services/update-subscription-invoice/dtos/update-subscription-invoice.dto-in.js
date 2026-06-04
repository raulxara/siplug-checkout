"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionInvoiceDtoIn = void 0;
class UpdateSubscriptionInvoiceDtoIn {
    _id;
    paymentTransactionId;
    gatewayInvoiceId;
    lastAttemptAt;
    attemptNumber;
    paidAt;
    metadata;
    config;
    status;
    source;
    constructor(_id, paymentTransactionId, gatewayInvoiceId, lastAttemptAt, attemptNumber, paidAt, metadata, config, status, source) {
        this._id = _id;
        this.paymentTransactionId = paymentTransactionId;
        this.gatewayInvoiceId = gatewayInvoiceId;
        this.lastAttemptAt = lastAttemptAt;
        this.attemptNumber = attemptNumber;
        this.paidAt = paidAt;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
        this.source = source;
    }
}
exports.UpdateSubscriptionInvoiceDtoIn = UpdateSubscriptionInvoiceDtoIn;
//# sourceMappingURL=update-subscription-invoice.dto-in.js.map