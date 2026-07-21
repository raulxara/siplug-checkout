"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApiCredentialDtoIn = void 0;
class UpdateApiCredentialDtoIn {
    token;
    apiCredentialId;
    officeId;
    clientId;
    gatewayId;
    name;
    slug;
    provider;
    providerType;
    environment;
    providerToken;
    origin;
    config;
    expiresAt;
    status;
    source;
    constructor(params) {
        this.token = params.token ?? '';
        this.apiCredentialId = params.apiCredentialId ?? '';
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.provider = params.provider ?? null;
        this.providerType = params.providerType ?? null;
        this.environment = params.environment ?? null;
        this.providerToken = params.providerToken ?? null;
        this.origin = params.origin ?? null;
        this.config = params.config ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateApiCredentialUseCase';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.apiCredentialId.trim() === '') {
            throw new Error('apiCredentialId is required');
        }
    }
}
exports.UpdateApiCredentialDtoIn = UpdateApiCredentialDtoIn;
//# sourceMappingURL=update-api-credential.dto-in.js.map