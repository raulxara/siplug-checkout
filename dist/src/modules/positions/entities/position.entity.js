"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class PositionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId = null;
    name;
    slug;
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
            officeId: fresh.officeId,
            name: fresh.name,
            slug: fresh.slug,
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
exports.PositionEntity = PositionEntity;
//# sourceMappingURL=position.entity.js.map