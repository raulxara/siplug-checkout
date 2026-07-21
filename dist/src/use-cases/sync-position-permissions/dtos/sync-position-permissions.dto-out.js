"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPositionPermissionsDtoOut = void 0;
class SyncPositionPermissionsDtoOut {
    position;
    permissions;
    requestedPermissionIds;
    created;
    activated;
    inactivated;
    kept;
    totalRequested;
    totalCreated;
    totalActivated;
    totalInactivated;
    totalKept;
    constructor(position, permissions, requestedPermissionIds, created, activated, inactivated, kept, totalRequested, totalCreated, totalActivated, totalInactivated, totalKept) {
        this.position = position;
        this.permissions = permissions;
        this.requestedPermissionIds = requestedPermissionIds;
        this.created = created;
        this.activated = activated;
        this.inactivated = inactivated;
        this.kept = kept;
        this.totalRequested = totalRequested;
        this.totalCreated = totalCreated;
        this.totalActivated = totalActivated;
        this.totalInactivated = totalInactivated;
        this.totalKept = totalKept;
    }
}
exports.SyncPositionPermissionsDtoOut = SyncPositionPermissionsDtoOut;
//# sourceMappingURL=sync-position-permissions.dto-out.js.map