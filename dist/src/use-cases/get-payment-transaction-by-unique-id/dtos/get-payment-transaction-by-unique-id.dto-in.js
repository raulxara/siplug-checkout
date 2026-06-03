"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentTransactionByUniqueIdDtoIn = void 0;
class GetPaymentTransactionByUniqueIdDtoIn {
    token;
    paymentTransactionId;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.paymentTransactionId ||
            params.paymentTransactionId.trim() === '') {
            throw new Error('paymentTransactionId is required');
        }
        this.token = params.token.trim();
        this.paymentTransactionId = params.paymentTransactionId.trim();
    }
}
exports.GetPaymentTransactionByUniqueIdDtoIn = GetPaymentTransactionByUniqueIdDtoIn;
//# sourceMappingURL=get-payment-transaction-by-unique-id.dto-in.js.map