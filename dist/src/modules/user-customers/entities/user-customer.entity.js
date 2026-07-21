"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCustomerEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class UserCustomerEntity extends abstract_entity_1.AbstractEntity {
    repository;
    clientId;
    profileId;
    token;
    twoFaRequired = false;
    twoFaActive = false;
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
            clientId: fresh.clientId,
            profileId: fresh.profileId,
            token: fresh.token,
            twoFaRequired: fresh.twoFaRequired,
            twoFaActive: fresh.twoFaActive,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.UserCustomerEntity = UserCustomerEntity;
//# sourceMappingURL=user-customer.entity.js.map