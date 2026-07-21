"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSubscriptionInvoiceByUniqueIdDtoIn = void 0;
class FindSubscriptionInvoiceByUniqueIdDtoIn {
    subscriptionInvoiceId;
    constructor(subscriptionInvoiceId) {
        if (!subscriptionInvoiceId || subscriptionInvoiceId.trim() === '') {
            throw new Error('subscriptionInvoiceId is required');
        }
        this.subscriptionInvoiceId = subscriptionInvoiceId.trim();
    }
}
exports.FindSubscriptionInvoiceByUniqueIdDtoIn = FindSubscriptionInvoiceByUniqueIdDtoIn;
//# sourceMappingURL=find-subscription-invoice-by-unique-id.dto-in.js.map