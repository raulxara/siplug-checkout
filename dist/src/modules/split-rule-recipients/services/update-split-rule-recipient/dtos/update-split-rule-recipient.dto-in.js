"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRuleRecipientDtoIn = void 0;
class UpdateSplitRuleRecipientDtoIn {
    _id;
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
    source;
    constructor(_id, splitRuleId, splitRecipientId, role, percentage, fixedAmount, liableForGatewayFee, liableForRefund, priority, metadata, config, status, source) {
        this._id = _id;
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
        this.source = source;
    }
}
exports.UpdateSplitRuleRecipientDtoIn = UpdateSplitRuleRecipientDtoIn;
//# sourceMappingURL=update-split-rule-recipient.dto-in.js.map