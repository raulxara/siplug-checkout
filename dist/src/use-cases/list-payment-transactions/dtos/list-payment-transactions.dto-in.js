"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentTransactionsDtoIn = void 0;
class ListPaymentTransactionsDtoIn {
    token;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        this.token = params.token.trim();
    }
}
exports.ListPaymentTransactionsDtoIn = ListPaymentTransactionsDtoIn;
//# sourceMappingURL=list-payment-transactions.dto-in.js.map