"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchPaymentTransactionToGatewayDtoIn = void 0;
class DispatchPaymentTransactionToGatewayDtoIn {
    token;
    paymentTransactionId;
    constructor(params) {
        this.token = params.token ?? '';
        this.paymentTransactionId = params.paymentTransactionId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.paymentTransactionId.trim() === '') {
            throw new Error('paymentTransactionId is required');
        }
    }
}
exports.DispatchPaymentTransactionToGatewayDtoIn = DispatchPaymentTransactionToGatewayDtoIn;
//# sourceMappingURL=dispatch-payment-transaction-to-gateway.dto-in.js.map