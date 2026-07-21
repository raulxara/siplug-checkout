"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentCustomerByUniqueIdDtoIn = void 0;
class GetPaymentCustomerByUniqueIdDtoIn {
    token;
    paymentCustomerId;
    constructor(params) {
        this.token = params.token ?? '';
        this.paymentCustomerId = params.paymentCustomerId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.paymentCustomerId.trim() === '') {
            throw new Error('paymentCustomerId is required');
        }
    }
}
exports.GetPaymentCustomerByUniqueIdDtoIn = GetPaymentCustomerByUniqueIdDtoIn;
//# sourceMappingURL=get-payment-customer-by-unique-id.dto-in.js.map