"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPositionEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class UserPositionEntity extends abstract_entity_1.AbstractEntity {
    repository;
    userCustomerId;
    positionId;
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
            userCustomerId: fresh.userCustomerId,
            positionId: fresh.positionId,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.UserPositionEntity = UserPositionEntity;
//# sourceMappingURL=user-position.entity.js.map