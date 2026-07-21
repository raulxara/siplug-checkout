"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterApiCredentialDtoOut = void 0;
class RegisterApiCredentialDtoOut {
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
    static fromCreateApiCredentialDtoOut(dtoOut) {
        return new RegisterApiCredentialDtoOut(dtoOut.id, dtoOut._id, dtoOut.officeId, dtoOut.clientId, dtoOut.gatewayId, dtoOut.name, dtoOut.slug, dtoOut.provider, dtoOut.providerType, dtoOut.environment, dtoOut.origin, dtoOut.config, dtoOut.expiresAt, dtoOut.changesHistory, dtoOut.status, dtoOut.createdAt, dtoOut.updatedAt);
    }
}
exports.RegisterApiCredentialDtoOut = RegisterApiCredentialDtoOut;
//# sourceMappingURL=register-api-credential.dto-out.js.map