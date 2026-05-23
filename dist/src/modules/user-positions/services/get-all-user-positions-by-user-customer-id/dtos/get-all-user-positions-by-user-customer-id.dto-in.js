"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUserPositionsByUserCustomerIdDtoIn = void 0;
class GetAllUserPositionsByUserCustomerIdDtoIn {
    userCustomerId;
    constructor(userCustomerId) {
        this.userCustomerId = userCustomerId;
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
    }
}
exports.GetAllUserPositionsByUserCustomerIdDtoIn = GetAllUserPositionsByUserCustomerIdDtoIn;
//# sourceMappingURL=get-all-user-positions-by-user-customer-id.dto-in.js.map