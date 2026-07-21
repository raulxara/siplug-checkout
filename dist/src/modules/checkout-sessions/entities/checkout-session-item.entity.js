"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSessionItemEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class CheckoutSessionItemEntity extends abstract_entity_1.AbstractEntity {
    repository;
    checkoutSessionId;
    itemRef = null;
    itemType = null;
    name;
    description = null;
    quantity;
    unitAmount;
    totalAmount;
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
            checkoutSessionId: fresh.checkoutSessionId,
            itemRef: fresh.itemRef,
            itemType: fresh.itemType,
            name: fresh.name,
            description: fresh.description,
            quantity: fresh.quantity,
            unitAmount: fresh.unitAmount,
            totalAmount: fresh.totalAmount,
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
exports.CheckoutSessionItemEntity = CheckoutSessionItemEntity;
//# sourceMappingURL=checkout-session-item.entity.js.map