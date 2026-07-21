"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class GatewayEntity extends abstract_entity_1.AbstractEntity {
    repository;
    name;
    slug;
    provider;
    description = null;
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
            name: fresh.name,
            slug: fresh.slug,
            provider: fresh.provider,
            description: fresh.description,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.GatewayEntity = GatewayEntity;
//# sourceMappingURL=gateway.entity.js.map