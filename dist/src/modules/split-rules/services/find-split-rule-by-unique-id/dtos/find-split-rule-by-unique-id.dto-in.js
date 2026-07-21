"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSplitRuleByUniqueIdDtoIn = void 0;
class FindSplitRuleByUniqueIdDtoIn {
    splitRuleId;
    constructor(splitRuleId) {
        this.splitRuleId = String(splitRuleId ?? '').trim();
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
    }
}
exports.FindSplitRuleByUniqueIdDtoIn = FindSplitRuleByUniqueIdDtoIn;
//# sourceMappingURL=find-split-rule-by-unique-id.dto-in.js.map