"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionInvoiceDtoIn = void 0;
class UpdateSubscriptionInvoiceDtoIn {
    token;
    subscriptionInvoiceId;
    paymentTransactionId;
    gatewayInvoiceId;
    paidAt;
    dueAt;
    lastAttemptAt;
    attemptNumber;
    metadata;
    config;
    status;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionInvoiceId = String(params.subscriptionInvoiceId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionInvoiceId === '') {
            throw new Error('subscriptionInvoiceId is required');
        }
        this.paymentTransactionId = this.toNullableString(params.paymentTransactionId);
        this.gatewayInvoiceId = this.toNullableString(params.gatewayInvoiceId);
        this.paidAt = this.toNullableString(params.paidAt);
        this.dueAt = this.toNullableString(params.dueAt);
        this.lastAttemptAt = this.toNullableString(params.lastAttemptAt);
        this.attemptNumber = this.toNullableNumber(params.attemptNumber);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status);
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableNumber(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            throw new Error(`invalid number value: ${String(value)}`);
        }
        return numberValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('metadata/config must be an object');
        }
        return value;
    }
}
exports.UpdateSubscriptionInvoiceDtoIn = UpdateSubscriptionInvoiceDtoIn;
//# sourceMappingURL=update-subscription-invoice.dto-in.js.map