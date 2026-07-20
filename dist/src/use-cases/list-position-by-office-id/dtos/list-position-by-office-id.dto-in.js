"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPositionByOfficeIdDtoIn = void 0;
class ListPositionByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListPositionByOfficeIdDtoIn = ListPositionByOfficeIdDtoIn;
//# sourceMappingURL=list-position-by-office-id.dto-in.js.map