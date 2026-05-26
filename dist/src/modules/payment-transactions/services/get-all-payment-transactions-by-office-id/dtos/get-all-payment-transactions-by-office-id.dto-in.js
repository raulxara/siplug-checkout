"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentTransactionsByOfficeIdDtoIn = void 0;
class GetAllPaymentTransactionsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllPaymentTransactionsByOfficeIdDtoIn = GetAllPaymentTransactionsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-payment-transactions-by-office-id.dto-in.js.map