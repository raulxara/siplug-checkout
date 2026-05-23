"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPermissionsByOfficeIdDtoIn = void 0;
class GetAllPermissionsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllPermissionsByOfficeIdDtoIn = GetAllPermissionsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-permissions-by-office-id.dto-in.js.map