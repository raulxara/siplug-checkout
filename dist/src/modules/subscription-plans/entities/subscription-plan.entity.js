"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class SubscriptionPlanEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId;
    clientId;
    gatewayId = null;
    apiCredentialId = null;
    gatewayPlanId = null;
    name;
    slug;
    description = null;
    billingInterval;
    billingIntervalCount = 1;
    amount;
    currency;
    trialDays = null;
    maxBillingCycles = null;
    paymentMethods = null;
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
            officeId: fresh.officeId,
            clientId: fresh.clientId,
            gatewayId: fresh.gatewayId,
            apiCredentialId: fresh.apiCredentialId,
            gatewayPlanId: fresh.gatewayPlanId,
            name: fresh.name,
            slug: fresh.slug,
            description: fresh.description,
            billingInterval: fresh.billingInterval,
            billingIntervalCount: fresh.billingIntervalCount,
            amount: fresh.amount,
            currency: fresh.currency,
            trialDays: fresh.trialDays,
            maxBillingCycles: fresh.maxBillingCycles,
            paymentMethods: fresh.paymentMethods,
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
exports.SubscriptionPlanEntity = SubscriptionPlanEntity;
//# sourceMappingURL=subscription-plan.entity.js.map