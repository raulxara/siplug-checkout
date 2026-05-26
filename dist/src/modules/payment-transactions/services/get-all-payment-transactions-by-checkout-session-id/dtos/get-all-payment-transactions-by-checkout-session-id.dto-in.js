"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentTransactionsByCheckoutSessionIdDtoIn = void 0;
class GetAllPaymentTransactionsByCheckoutSessionIdDtoIn {
    checkoutSessionId;
    constructor(checkoutSessionId) {
        this.checkoutSessionId = checkoutSessionId;
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
    }
}
exports.GetAllPaymentTransactionsByCheckoutSessionIdDtoIn = GetAllPaymentTransactionsByCheckoutSessionIdDtoIn;
//# sourceMappingURL=get-all-payment-transactions-by-checkout-session-id.dto-in.js.map