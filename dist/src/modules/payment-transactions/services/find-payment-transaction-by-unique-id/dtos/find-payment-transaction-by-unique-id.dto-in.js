"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPaymentTransactionByUniqueIdDtoIn = void 0;
class FindPaymentTransactionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindPaymentTransactionByUniqueIdDtoIn = FindPaymentTransactionByUniqueIdDtoIn;
//# sourceMappingURL=find-payment-transaction-by-unique-id.dto-in.js.map