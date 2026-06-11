"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentSplitsByPaymentTransactionIdDtoIn = void 0;
class GetAllPaymentSplitsByPaymentTransactionIdDtoIn {
    paymentTransactionId;
    constructor(paymentTransactionId) {
        this.paymentTransactionId = String(paymentTransactionId ?? '').trim();
        if (this.paymentTransactionId === '') {
            throw new Error('paymentTransactionId is required');
        }
    }
}
exports.GetAllPaymentSplitsByPaymentTransactionIdDtoIn = GetAllPaymentSplitsByPaymentTransactionIdDtoIn;
//# sourceMappingURL=get-all-payment-splits-by-payment-transaction-id.dto-in.js.map