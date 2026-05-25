"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccessCodeEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class UserAccessCodeEntity extends abstract_entity_1.AbstractEntity {
    repository;
    userCustomerId;
    channel;
    destination;
    code;
    expiresAt = null;
    usedAt = null;
    sentAt = null;
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
            channel: fresh.channel,
            destination: fresh.destination,
            code: fresh.code,
            expiresAt: fresh.expiresAt,
            usedAt: fresh.usedAt,
            sentAt: fresh.sentAt,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.UserAccessCodeEntity = UserAccessCodeEntity;
//# sourceMappingURL=user-access-code.entity.js.map