"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRuleRecipientEntity = void 0;
class SplitRuleRecipientEntity {
    splitRuleRecipientsRepository;
    id = null;
    _id = null;
    splitRuleId;
    splitRecipientId;
    role = 'secondary';
    percentage = null;
    fixedAmount = null;
    liableForGatewayFee = false;
    liableForRefund = false;
    priority = 0;
    metadata = null;
    config = null;
    changesHistory = null;
    status = 'active';
    createdAt = null;
    updatedAt = null;
    constructor(splitRuleRecipientsRepository) {
        this.splitRuleRecipientsRepository = splitRuleRecipientsRepository;
    }
    async create() {
        if (!this.splitRuleRecipientsRepository) {
            throw new Error('splitRuleRecipientsRepository is required');
        }
        const created = await this.splitRuleRecipientsRepository.create(this);
        this.id = created.id;
        this._id = created._id;
        this.splitRuleId = created.splitRuleId;
        this.splitRecipientId = created.splitRecipientId;
        this.role = created.role;
        this.percentage = created.percentage;
        this.fixedAmount = created.fixedAmount;
        this.liableForGatewayFee = created.liableForGatewayFee;
        this.liableForRefund = created.liableForRefund;
        this.priority = created.priority;
        this.metadata = created.metadata;
        this.config = created.config;
        this.changesHistory = created.changesHistory;
        this.status = created.status;
        this.createdAt = created.createdAt;
        this.updatedAt = created.updatedAt;
        return this;
    }
}
exports.SplitRuleRecipientEntity = SplitRuleRecipientEntity;
//# sourceMappingURL=split-rule-recipient.entity.js.map