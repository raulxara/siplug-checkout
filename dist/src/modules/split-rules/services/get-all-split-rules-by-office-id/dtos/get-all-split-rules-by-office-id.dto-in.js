"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSplitRulesByOfficeIdDtoIn = void 0;
class GetAllSplitRulesByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllSplitRulesByOfficeIdDtoIn = GetAllSplitRulesByOfficeIdDtoIn;
//# sourceMappingURL=get-all-split-rules-by-office-id.dto-in.js.map