"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPermissionsByOfficeIdDtoIn = void 0;
class ListPermissionsByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListPermissionsByOfficeIdDtoIn = ListPermissionsByOfficeIdDtoIn;
//# sourceMappingURL=list-permissions-by-office-id.dto-in.js.map