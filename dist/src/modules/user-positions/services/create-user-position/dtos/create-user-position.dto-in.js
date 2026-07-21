"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserPositionDtoIn = void 0;
class CreateUserPositionDtoIn {
    userCustomerId;
    positionId;
    config;
    status;
    constructor(params) {
        this.userCustomerId = params.userCustomerId;
        this.positionId = params.positionId;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.userCustomerId.trim() === '') {
            throw new Error('userCustomerId is required');
        }
        if (this.positionId.trim() === '') {
            throw new Error('positionId is required');
        }
    }
}
exports.CreateUserPositionDtoIn = CreateUserPositionDtoIn;
//# sourceMappingURL=create-user-position.dto-in.js.map