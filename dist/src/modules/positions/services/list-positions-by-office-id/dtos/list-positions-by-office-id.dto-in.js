"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPositionsByOfficeIdDtoIn = void 0;
class ListPositionsByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListPositionsByOfficeIdDtoIn = ListPositionsByOfficeIdDtoIn;
//# sourceMappingURL=list-positions-by-office-id.dto-in.js.map