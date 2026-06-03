"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCredentialEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class ApiCredentialEntity extends abstract_entity_1.AbstractEntity {
    repository;
    officeId = null;
    clientId = null;
    gatewayId = null;
    name;
    slug;
    provider;
    providerType;
    environment;
    token = null;
    origin = null;
    config = null;
    expiresAt = null;
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
            gatewayId: fresh.gatewayId,
            name: fresh.name,
            slug: fresh.slug,
            provider: fresh.provider,
            providerType: fresh.providerType,
            environment: fresh.environment,
            token: fresh.token,
            origin: fresh.origin,
            config: fresh.config,
            expiresAt: fresh.expiresAt,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.ApiCredentialEntity = ApiCredentialEntity;
//# sourceMappingURL=api-credential.entity.js.map