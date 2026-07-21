"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class SubscriptionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId;
    clientId;
    subscriptionPlanId = null;
    paymentCustomerId;
    gatewayId = null;
    apiCredentialId = null;
    gatewaySubscriptionId = null;
    externalReference = null;
    amount;
    currency;
    currentCycle = 0;
    nextBillingAt = null;
    startedAt = null;
    canceledAt = null;
    endedAt = null;
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
            subscriptionPlanId: fresh.subscriptionPlanId,
            paymentCustomerId: fresh.paymentCustomerId,
            gatewayId: fresh.gatewayId,
            apiCredentialId: fresh.apiCredentialId,
            gatewaySubscriptionId: fresh.gatewaySubscriptionId,
            externalReference: fresh.externalReference,
            amount: fresh.amount,
            currency: fresh.currency,
            currentCycle: fresh.currentCycle,
            nextBillingAt: fresh.nextBillingAt,
            startedAt: fresh.startedAt,
            canceledAt: fresh.canceledAt,
            endedAt: fresh.endedAt,
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
exports.SubscriptionEntity = SubscriptionEntity;
//# sourceMappingURL=subscription.entity.js.map