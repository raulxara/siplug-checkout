"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPermissionByUniqueIdDtoIn = void 0;
class GetPermissionByUniqueIdDtoIn {
    permissionId;
    constructor(params) {
        this.permissionId = String(params.permissionId ?? params._id ?? '').trim();
        if (this.permissionId === '') {
            throw new Error('permissionId is required');
        }
    }
}
exports.GetPermissionByUniqueIdDtoIn = GetPermissionByUniqueIdDtoIn;
//# sourceMappingURL=get-permission-by-unique-id.dto-in.js.map