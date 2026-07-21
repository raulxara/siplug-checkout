"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPositionPermissionByPositionAndPermissionDtoIn = void 0;
class FindPositionPermissionByPositionAndPermissionDtoIn {
    positionId;
    permissionId;
    constructor(params) {
        this.positionId = params.positionId;
        this.permissionId = params.permissionId;
        if (this.positionId.trim() === '') {
            throw new Error('positionId is required');
        }
        if (this.permissionId.trim() === '') {
            throw new Error('permissionId is required');
        }
    }
}
exports.FindPositionPermissionByPositionAndPermissionDtoIn = FindPositionPermissionByPositionAndPermissionDtoIn;
//# sourceMappingURL=find-position-permission-by-position-and-permission.dto-in.js.map