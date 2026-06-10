"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncSplitRuleRecipientsDtoOut = void 0;
class SyncSplitRuleRecipientsDtoOut {
    splitRule;
    splitRuleRecipients;
    createdCount;
    updatedCount;
    inactivatedCount;
    constructor(splitRule, splitRuleRecipients, createdCount, updatedCount, inactivatedCount) {
        this.splitRule = splitRule;
        this.splitRuleRecipients = splitRuleRecipients;
        this.createdCount = createdCount;
        this.updatedCount = updatedCount;
        this.inactivatedCount = inactivatedCount;
    }
}
exports.SyncSplitRuleRecipientsDtoOut = SyncSplitRuleRecipientsDtoOut;
//# sourceMappingURL=sync-split-rule-recipients.dto-out.js.map