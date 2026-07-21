"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSplitRuleRecipientsBySplitRuleIdDtoIn = void 0;
class GetAllSplitRuleRecipientsBySplitRuleIdDtoIn {
    splitRuleId;
    constructor(splitRuleId) {
        this.splitRuleId = String(splitRuleId ?? '').trim();
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
    }
}
exports.GetAllSplitRuleRecipientsBySplitRuleIdDtoIn = GetAllSplitRuleRecipientsBySplitRuleIdDtoIn;
//# sourceMappingURL=get-all-split-rule-recipients-by-split-rule-id.dto-in.js.map