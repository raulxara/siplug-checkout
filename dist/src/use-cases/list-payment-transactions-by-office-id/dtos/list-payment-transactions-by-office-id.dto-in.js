"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentTransactionsByOfficeIdDtoIn = void 0;
class ListPaymentTransactionsByOfficeIdDtoIn {
    token;
    officeId;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.officeId || params.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        this.token = params.token.trim();
        this.officeId = params.officeId.trim();
    }
}
exports.ListPaymentTransactionsByOfficeIdDtoIn = ListPaymentTransactionsByOfficeIdDtoIn;
//# sourceMappingURL=list-payment-transactions-by-office-id.dto-in.js.map