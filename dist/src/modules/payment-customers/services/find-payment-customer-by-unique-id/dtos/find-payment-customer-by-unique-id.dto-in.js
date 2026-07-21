"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPaymentCustomerByUniqueIdDtoIn = void 0;
class FindPaymentCustomerByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindPaymentCustomerByUniqueIdDtoIn = FindPaymentCustomerByUniqueIdDtoIn;
//# sourceMappingURL=find-payment-customer-by-unique-id.dto-in.js.map