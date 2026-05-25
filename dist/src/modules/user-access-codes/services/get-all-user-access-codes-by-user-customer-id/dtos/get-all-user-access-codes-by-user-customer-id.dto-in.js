"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUserAccessCodesByUserCustomerIdDtoIn = void 0;
class GetAllUserAccessCodesByUserCustomerIdDtoIn {
    userCustomerId;
    constructor(userCustomerId) {
        this.userCustomerId = userCustomerId;
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
    }
}
exports.GetAllUserAccessCodesByUserCustomerIdDtoIn = GetAllUserAccessCodesByUserCustomerIdDtoIn;
//# sourceMappingURL=get-all-user-access-codes-by-user-customer-id.dto-in.js.map