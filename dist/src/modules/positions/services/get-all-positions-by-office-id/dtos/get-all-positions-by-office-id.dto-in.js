"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPositionsByOfficeIdDtoIn = void 0;
class GetAllPositionsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllPositionsByOfficeIdDtoIn = GetAllPositionsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-positions-by-office-id.dto-in.js.map