"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserCustomerByUniqueIdDtoIn = void 0;
class FindUserCustomerByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindUserCustomerByUniqueIdDtoIn = FindUserCustomerByUniqueIdDtoIn;
//# sourceMappingURL=find-user-customer-by-unique-id.dto-in.js.map