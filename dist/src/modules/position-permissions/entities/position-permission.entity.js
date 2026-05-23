"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionPermissionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class PositionPermissionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    positionId;
    permissionId;
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
            positionId: fresh.positionId,
            permissionId: fresh.permissionId,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.PositionPermissionEntity = PositionPermissionEntity;
//# sourceMappingURL=position-permission.entity.js.map