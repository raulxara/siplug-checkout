"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class ClientEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId = null;
    customerId = null;
    userType;
    username;
    password;
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
            customerId: fresh.customerId,
            userType: fresh.userType,
            username: fresh.username,
            password: fresh.password,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.ClientEntity = ClientEntity;
//# sourceMappingURL=client.entity.js.map