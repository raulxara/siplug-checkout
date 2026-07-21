"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSplitRuleRecipientByRuleAndRecipientDtoIn = void 0;
class FindSplitRuleRecipientByRuleAndRecipientDtoIn {
    splitRuleId;
    splitRecipientId;
    constructor(params) {
        this.splitRuleId = String(params.splitRuleId ?? '').trim();
        this.splitRecipientId = String(params.splitRecipientId ?? '').trim();
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
        if (this.splitRecipientId === '') {
            throw new Error('splitRecipientId is required');
        }
    }
}
exports.FindSplitRuleRecipientByRuleAndRecipientDtoIn = FindSplitRuleRecipientByRuleAndRecipientDtoIn;
//# sourceMappingURL=find-split-rule-recipient-by-rule-and-recipient.dto-in.js.map