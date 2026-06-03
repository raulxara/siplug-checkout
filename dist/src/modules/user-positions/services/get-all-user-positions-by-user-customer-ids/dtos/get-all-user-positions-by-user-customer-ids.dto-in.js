"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUserPositionsByUserCustomerIdsDtoIn = void 0;
class GetAllUserPositionsByUserCustomerIdsDtoIn {
    userCustomerIds;
    constructor(userCustomerIds) {
        this.userCustomerIds = userCustomerIds;
        if (!Array.isArray(this.userCustomerIds) ||
            this.userCustomerIds.length === 0) {
            throw new Error('userCustomerIds is required');
        }
        for (const userCustomerId of this.userCustomerIds) {
            if (userCustomerId.trim() === '') {
                throw new Error('userCustomerIds contains invalid value');
            }
        }
    }
}
exports.GetAllUserPositionsByUserCustomerIdsDtoIn = GetAllUserPositionsByUserCustomerIdsDtoIn;
//# sourceMappingURL=get-all-user-positions-by-user-customer-ids.dto-in.js.map