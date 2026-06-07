"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSplitRecipientsByOfficeIdDtoIn = void 0;
class GetAllSplitRecipientsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllSplitRecipientsByOfficeIdDtoIn = GetAllSplitRecipientsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-split-recipients-by-office-id.dto-in.js.map