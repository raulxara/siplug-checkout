"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionInvoiceEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class SubscriptionInvoiceEntity extends abstract_entity_1.AbstractEntity {
    repository;
    subscriptionId;
    subscriptionCycleId = null;
    paymentTransactionId = null;
    invoiceNumber = null;
    amount;
    currency;
    dueAt = null;
    paidAt = null;
    attemptNumber = 1;
    externalReference = null;
    gatewayInvoiceId = null;
    lastAttemptAt = null;
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
            subscriptionCycleId: fresh.subscriptionCycleId,
            paymentTransactionId: fresh.paymentTransactionId,
            invoiceNumber: fresh.invoiceNumber,
            amount: fresh.amount,
            currency: fresh.currency,
            dueAt: fresh.dueAt,
            paidAt: fresh.paidAt,
            attemptNumber: fresh.attemptNumber,
            externalReference: fresh.externalReference,
            gatewayInvoiceId: fresh.gatewayInvoiceId,
            lastAttemptAt: fresh.lastAttemptAt,
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
exports.SubscriptionInvoiceEntity = SubscriptionInvoiceEntity;
//# sourceMappingURL=subscription-invoice.entity.js.map