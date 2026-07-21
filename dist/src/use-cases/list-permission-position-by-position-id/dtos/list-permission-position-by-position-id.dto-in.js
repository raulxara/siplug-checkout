"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPermissionPositionByPositionIdDtoIn = void 0;
class ListPermissionPositionByPositionIdDtoIn {
    positionId;
    officeId;
    constructor(params) {
        this.positionId = String(params.positionId ?? '').trim();
        if (this.positionId === '') {
            throw new Error('positionId is required');
        }
        const officeId = this.normalizeOptionalString(params.officeId);
        if (officeId !== undefined) {
            this.officeId = officeId;
        }
    }
    normalizeOptionalString(value) {
        if (value === undefined || value === null) {
            return undefined;
        }
        const normalized = String(value).trim();
        if (normalized === '') {
            return undefined;
        }
        return normalized;
    }
}
exports.ListPermissionPositionByPositionIdDtoIn = ListPermissionPositionByPositionIdDtoIn;
//# sourceMappingURL=list-permission-position-by-position-id.dto-in.js.map