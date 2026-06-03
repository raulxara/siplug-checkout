"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApiCredentialDtoOut = void 0;
class CreateApiCredentialDtoOut {
    id;
    _id;
    officeId;
    clientId;
    gatewayId;
    name;
    slug;
    provider;
    providerType;
    environment;
    origin;
    config;
    expiresAt;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, clientId, gatewayId, name, slug, provider, providerType, environment, origin, config, expiresAt, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.clientId = clientId;
        this.gatewayId = gatewayId;
        this.name = name;
        this.slug = slug;
        this.provider = provider;
        this.providerType = providerType;
        this.environment = environment;
        this.origin = origin;
        this.config = config;
        this.expiresAt = expiresAt;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateApiCredentialDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.clientId, entity.gatewayId, entity.name, entity.slug, entity.provider, entity.providerType, entity.environment, entity.origin, entity.config, entity.expiresAt, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateApiCredentialDtoOut = CreateApiCredentialDtoOut;
//# sourceMappingURL=create-api-credential.dto-out.js.map