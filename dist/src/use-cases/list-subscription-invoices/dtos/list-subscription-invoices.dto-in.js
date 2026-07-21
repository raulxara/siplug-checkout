"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionInvoicesDtoIn = void 0;
class ListSubscriptionInvoicesDtoIn {
    token;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
    }
}
exports.ListSubscriptionInvoicesDtoIn = ListSubscriptionInvoicesDtoIn;
//# sourceMappingURL=list-subscription-invoices.dto-in.js.map