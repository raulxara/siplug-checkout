"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionInvoiceByUniqueIdDtoIn = void 0;
class GetSubscriptionInvoiceByUniqueIdDtoIn {
    token;
    subscriptionInvoiceId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionInvoiceId = String(params.subscriptionInvoiceId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionInvoiceId === '') {
            throw new Error('subscriptionInvoiceId is required');
        }
    }
}
exports.GetSubscriptionInvoiceByUniqueIdDtoIn = GetSubscriptionInvoiceByUniqueIdDtoIn;
//# sourceMappingURL=get-subscription-invoice-by-unique-id.dto-in.js.map