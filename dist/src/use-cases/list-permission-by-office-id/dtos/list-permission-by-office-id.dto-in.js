"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPermissionByOfficeIdDtoIn = void 0;
class ListPermissionByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListPermissionByOfficeIdDtoIn = ListPermissionByOfficeIdDtoIn;
//# sourceMappingURL=list-permission-by-office-id.dto-in.js.map