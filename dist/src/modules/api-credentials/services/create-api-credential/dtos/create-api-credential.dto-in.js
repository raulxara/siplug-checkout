"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApiCredentialDtoIn = void 0;
class CreateApiCredentialDtoIn {
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
    constructor(params) {
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.name = params.name;
        this.slug = params.slug;
        this.provider = params.provider;
        this.providerType = params.providerType;
        this.environment = params.environment ?? 'local';
        this.token = params.token;
        this.origin = params.origin ?? null;
        this.config = params.config ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.status = params.status ?? 'active';
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
        if (this.provider.trim() === '') {
            throw new Error('provider is required');
        }
        if (this.providerType.trim() === '') {
            throw new Error('providerType is required');
        }
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
    }
}
exports.CreateApiCredentialDtoIn = CreateApiCredentialDtoIn;
//# sourceMappingURL=create-api-credential.dto-in.js.map