"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApiCredentialDtoIn = void 0;
class UpdateApiCredentialDtoIn {
    _id;
    officeId;
    clientId;
    gatewayId;
    name;
    slug;
    provider;
    providerType;
    environment;
    token;
    origin;
    config;
    expiresAt;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.provider = params.provider ?? null;
        this.providerType = params.providerType ?? null;
        this.environment = params.environment ?? null;
        this.token = params.token ?? null;
        this.origin = params.origin ?? null;
        this.config = params.config ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateApiCredentialService';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateApiCredentialDtoIn = UpdateApiCredentialDtoIn;
//# sourceMappingURL=update-api-credential.dto-in.js.map