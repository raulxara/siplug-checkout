"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserPositionByUserCustomerAndPositionDtoIn = void 0;
class FindUserPositionByUserCustomerAndPositionDtoIn {
    userCustomerId;
    positionId;
    constructor(params) {
        this.userCustomerId = params.userCustomerId;
        this.positionId = params.positionId;
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
        if (this.positionId.trim() === '') {
            throw new Error('positionId is required');
        }
    }
}
exports.FindUserPositionByUserCustomerAndPositionDtoIn = FindUserPositionByUserCustomerAndPositionDtoIn;
//# sourceMappingURL=find-user-position-by-user-customer-and-position.dto-in.js.map