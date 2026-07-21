"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentCustomersByOfficeIdDtoIn = void 0;
class GetPaymentCustomersByOfficeIdDtoIn {
    token;
    officeId;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetPaymentCustomersByOfficeIdDtoIn = GetPaymentCustomersByOfficeIdDtoIn;
//# sourceMappingURL=get-payment-customers-by-office-id.dto-in.js.map