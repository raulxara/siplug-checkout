"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentSplitsByPaymentTransactionIdDtoIn = void 0;
class ListPaymentSplitsByPaymentTransactionIdDtoIn {
    token;
    paymentTransactionId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.paymentTransactionId = String(params.paymentTransactionId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.paymentTransactionId === '') {
            throw new Error('paymentTransactionId is required');
        }
    }
}
exports.ListPaymentSplitsByPaymentTransactionIdDtoIn = ListPaymentSplitsByPaymentTransactionIdDtoIn;
//# sourceMappingURL=list-payment-splits-by-payment-transaction-id.dto-in.js.map