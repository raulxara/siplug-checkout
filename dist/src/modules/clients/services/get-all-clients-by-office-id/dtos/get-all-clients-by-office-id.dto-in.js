"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllClientsByOfficeIdDtoIn = void 0;
class GetAllClientsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllClientsByOfficeIdDtoIn = GetAllClientsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-clients-by-office-id.dto-in.js.map