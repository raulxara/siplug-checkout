"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSplitRuleByUniqueIdDtoIn = void 0;
class GetSplitRuleByUniqueIdDtoIn {
    token;
    splitRuleId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRuleId = String(params.splitRuleId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
    }
}
exports.GetSplitRuleByUniqueIdDtoIn = GetSplitRuleByUniqueIdDtoIn;
//# sourceMappingURL=get-split-rule-by-unique-id.dto-in.js.map