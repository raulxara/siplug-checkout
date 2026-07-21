"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCycleEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class SubscriptionCycleEntity extends abstract_entity_1.AbstractEntity {
    repository;
    subscriptionId;
    cycleNumber;
    amount;
    currency;
    periodStart = null;
    periodEnd = null;
    scheduledAt = null;
    processedAt = null;
    metadata = null;
    config = null;
    changesHistory = null;
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async create() {
        const fresh = await this.repository.create(this);
        this.hydrate({
            id: fresh.id,
            _id: fresh._id,
            subscriptionId: fresh.subscriptionId,
            cycleNumber: fresh.cycleNumber,
            amount: fresh.amount,
            currency: fresh.currency,
            periodStart: fresh.periodStart,
            periodEnd: fresh.periodEnd,
            scheduledAt: fresh.scheduledAt,
            processedAt: fresh.processedAt,
            metadata: fresh.metadata,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.SubscriptionCycleEntity = SubscriptionCycleEntity;
//# sourceMappingURL=subscription-cycle.entity.js.map