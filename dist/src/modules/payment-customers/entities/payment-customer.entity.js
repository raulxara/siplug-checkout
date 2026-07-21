"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCustomerEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class PaymentCustomerEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId;
    clientId;
    profileId = null;
    externalReference = null;
    name;
    email = null;
    documentType = null;
    documentValue = null;
    phone = null;
    billingAddress = null;
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
            profileId: fresh.profileId,
            externalReference: fresh.externalReference,
            name: fresh.name,
            email: fresh.email,
            documentType: fresh.documentType,
            documentValue: fresh.documentValue,
            phone: fresh.phone,
            billingAddress: fresh.billingAddress,
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
exports.PaymentCustomerEntity = PaymentCustomerEntity;
//# sourceMappingURL=payment-customer.entity.js.map