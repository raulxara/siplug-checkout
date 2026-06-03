"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckUserPermissionDtoOut = void 0;
class CheckUserPermissionDtoOut {
    allowed;
    isAdministrator;
    requiredAction;
    requiredEntity;
    positions;
    userPositions;
    positionPermissions;
    permissions;
    matchedPermission;
    constructor(allowed, isAdministrator, requiredAction, requiredEntity, positions, userPositions, positionPermissions, permissions, matchedPermission) {
        this.allowed = allowed;
        this.isAdministrator = isAdministrator;
        this.requiredAction = requiredAction;
        this.requiredEntity = requiredEntity;
        this.positions = positions;
        this.userPositions = userPositions;
        this.positionPermissions = positionPermissions;
        this.permissions = permissions;
        this.matchedPermission = matchedPermission;
    }
}
exports.CheckUserPermissionDtoOut = CheckUserPermissionDtoOut;
//# sourceMappingURL=check-user-permission.dto-out.js.map