"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSubscriptionInvoiceDtoIn = void 0;
class GenerateSubscriptionInvoiceDtoIn {
    token;
    subscriptionId;
    scheduledAt;
    dueAt;
    force;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.subscriptionId || params.subscriptionId.trim() === '') {
            throw new Error('subscriptionId is required');
        }
        this.token = params.token.trim();
        this.subscriptionId = params.subscriptionId.trim();
        this.scheduledAt = this.normalizeNullableString(params.scheduledAt);
        this.dueAt = this.normalizeNullableString(params.dueAt);
        this.force = Boolean(params.force);
    }
    normalizeNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.GenerateSubscriptionInvoiceDtoIn = GenerateSubscriptionInvoiceDtoIn;
//# sourceMappingURL=generate-subscription-invoice.dto-in.js.map