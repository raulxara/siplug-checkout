"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSplitRuleRecipientDtoIn = void 0;
class CreateSplitRuleRecipientDtoIn {
    splitRuleId;
    splitRecipientId;
    role;
    percentage;
    fixedAmount;
    liableForGatewayFee;
    liableForRefund;
    priority;
    metadata;
    config;
    status;
    constructor(splitRuleId, splitRecipientId, role, percentage, fixedAmount, liableForGatewayFee, liableForRefund, priority, metadata, config, status) {
        this.splitRuleId = splitRuleId;
        this.splitRecipientId = splitRecipientId;
        this.role = role;
        this.percentage = percentage;
        this.fixedAmount = fixedAmount;
        this.liableForGatewayFee = liableForGatewayFee;
        this.liableForRefund = liableForRefund;
        this.priority = priority;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSplitRuleRecipientDtoIn = CreateSplitRuleRecipientDtoIn;
//# sourceMappingURL=create-split-rule-recipient.dto-in.js.map