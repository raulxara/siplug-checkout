"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitRuleEntity = void 0;
class SplitRuleEntity {
    splitRulesRepository;
    id = null;
    _id = null;
    officeId;
    clientId;
    gatewayId = null;
    name;
    slug;
    description = null;
    splitType;
    calculationBase = 'gross_amount';
    priority = 0;
    metadata = null;
    config = null;
    changesHistory = null;
    status = 'active';
    createdAt = null;
    updatedAt = null;
    constructor(splitRulesRepository) {
        this.splitRulesRepository = splitRulesRepository;
    }
    async create() {
        if (!this.splitRulesRepository) {
            throw new Error('splitRulesRepository is required');
        }
        const created = await this.splitRulesRepository.create(this);
        this.id = created.id;
        this._id = created._id;
        this.officeId = created.officeId;
        this.clientId = created.clientId;
        this.gatewayId = created.gatewayId;
        this.name = created.name;
        this.slug = created.slug;
        this.description = created.description;
        this.splitType = created.splitType;
        this.calculationBase = created.calculationBase;
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
exports.SplitRuleEntity = SplitRuleEntity;
//# sourceMappingURL=split-rule.entity.js.map