"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUserPermissionDtoIn = void 0;
class CheckUserPermissionDtoIn {
    userCustomerId;
    requiredAction;
    requiredEntity;
    constructor(params) {
        this.userCustomerId = params.userCustomerId;
        this.requiredAction = params.requiredAction;
        this.requiredEntity = params.requiredEntity ?? null;
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
        if (this.requiredAction.trim() === '') {
            throw new Error('requiredAction is required');
        }
    }
}
exports.CheckUserPermissionDtoIn = CheckUserPermissionDtoIn;
//# sourceMappingURL=check-user-permission.dto-in.js.map