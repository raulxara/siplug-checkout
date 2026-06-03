"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentCustomersByOfficeIdDtoIn = void 0;
class GetAllPaymentCustomersByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllPaymentCustomersByOfficeIdDtoIn = GetAllPaymentCustomersByOfficeIdDtoIn;
//# sourceMappingURL=get-all-payment-customers-by-office-id.dto-in.js.map