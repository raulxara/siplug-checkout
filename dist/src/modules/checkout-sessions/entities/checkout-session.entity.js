"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSessionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class CheckoutSessionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId;
    clientId;
    paymentCustomerId = null;
    gatewayId;
    apiCredentialId = null;
    code = null;
    externalReference = null;
    idempotencyKey = null;
    paymentType;
    amount;
    currency;
    description = null;
    successUrl = null;
    cancelUrl = null;
    expiresAt = null;
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
            paymentCustomerId: fresh.paymentCustomerId,
            gatewayId: fresh.gatewayId,
            apiCredentialId: fresh.apiCredentialId,
            code: fresh.code,
            externalReference: fresh.externalReference,
            idempotencyKey: fresh.idempotencyKey,
            paymentType: fresh.paymentType,
            amount: fresh.amount,
            currency: fresh.currency,
            description: fresh.description,
            successUrl: fresh.successUrl,
            cancelUrl: fresh.cancelUrl,
            expiresAt: fresh.expiresAt,
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
exports.CheckoutSessionEntity = CheckoutSessionEntity;
//# sourceMappingURL=checkout-session.entity.js.map