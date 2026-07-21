"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePositionPermissionDtoIn = void 0;
class CreatePositionPermissionDtoIn {
    positionId;
    permissionId;
    config;
    status;
    constructor(params) {
        this.positionId = params.positionId;
        this.permissionId = params.permissionId;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.positionId.trim() === '') {
            throw new Error('positionId is required');
        }
        if (this.permissionId.trim() === '') {
            throw new Error('permissionId is required');
        }
    }
}
exports.CreatePositionPermissionDtoIn = CreatePositionPermissionDtoIn;
//# sourceMappingURL=create-position-permission.dto-in.js.map