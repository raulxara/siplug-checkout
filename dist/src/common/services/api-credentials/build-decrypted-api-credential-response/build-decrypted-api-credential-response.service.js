"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildDecryptedApiCredentialResponseService = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
let BuildDecryptedApiCredentialResponseService = class BuildDecryptedApiCredentialResponseService {
    decryptApiCredentialSecretService;
    secretKeys = [
        'client_token',
        'token',
        'secret',
        'password',
        'apiKey',
        'api_key',
        'clientSecret',
        'client_secret',
        'accessToken',
        'access_token',
        'refreshToken',
        'refresh_token',
        'privateKey',
        'private_key',
        'webhookSecret',
        'webhook_secret',
        'webhookToken',
        'webhook_token',
    ];
    constructor(decryptApiCredentialSecretService) {
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
    }
    exec(apiCredential) {
        return {
            id: apiCredential.id,
            _id: apiCredential._id,
            officeId: apiCredential.officeId,
            clientId: apiCredential.clientId,
            gatewayId: apiCredential.gatewayId,
            name: apiCredential.name,
            slug: apiCredential.slug,
            provider: apiCredential.provider,
            providerType: apiCredential.providerType,
            environment: apiCredential.environment,
            token: this.decryptToken(apiCredential.token),
            origin: apiCredential.origin,
            config: this.decryptConfig(apiCredential.config),
            expiresAt: apiCredential.expiresAt,
            changesHistory: apiCredential.changesHistory,
            status: apiCredential.status,
            createdAt: apiCredential.createdAt,
            updatedAt: apiCredential.updatedAt,
            secretsDecrypted: true,
        };
    }
    decryptToken(token) {
        if (token === null || token.trim() === '') {
            return null;
        }
        const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: {
                    token,
                },
            },
            keysToDecrypt: ['token'],
            strict: false,
        }));
        const config = this.toRecordOrNull(decryptedDtoOut.apiCredential.config);
        return this.extractString(config, 'token');
    }
    decryptConfig(config) {
        if (config === null) {
            return null;
        }
        const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config,
            },
            keysToDecrypt: this.secretKeys,
            strict: false,
        }));
        return this.toRecordOrNull(decryptedDtoOut.apiCredential.config);
    }
    toRecordOrNull(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    extractString(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const normalized = String(value).trim();
        return normalized === '' ? null : normalized;
    }
};
exports.BuildDecryptedApiCredentialResponseService = BuildDecryptedApiCredentialResponseService;
exports.BuildDecryptedApiCredentialResponseService = BuildDecryptedApiCredentialResponseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService])
], BuildDecryptedApiCredentialResponseService);
//# sourceMappingURL=build-decrypted-api-credential-response.service.js.map