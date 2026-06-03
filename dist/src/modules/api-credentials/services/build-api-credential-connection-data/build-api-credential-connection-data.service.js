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
exports.BuildApiCredentialConnectionDataService = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const find_active_api_credential_by_slug_dto_in_1 = require("../find-active-api-credential-by-slug/dtos/find-active-api-credential-by-slug.dto-in");
const find_active_api_credential_by_slug_service_1 = require("../find-active-api-credential-by-slug/find-active-api-credential-by-slug.service");
const build_api_credential_connection_data_dto_out_1 = require("./dtos/build-api-credential-connection-data.dto-out");
let BuildApiCredentialConnectionDataService = class BuildApiCredentialConnectionDataService {
    findActiveApiCredentialBySlugService;
    decryptApiCredentialSecretService;
    constructor(findActiveApiCredentialBySlugService, decryptApiCredentialSecretService) {
        this.findActiveApiCredentialBySlugService = findActiveApiCredentialBySlugService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
    }
    async exec(dtoIn) {
        try {
            const credentialDtoOut = await this.findActiveApiCredentialBySlugService.exec(new find_active_api_credential_by_slug_dto_in_1.FindActiveApiCredentialBySlugDtoIn(dtoIn.slug));
            const credential = credentialDtoOut.apiCredential;
            const config = credential.config ?? {};
            const baseUrl = String(config.base_url ?? '').trim();
            const logEndpoint = String(config.log_endpoint ?? '').trim();
            const tokenPrefix = String(config.token_prefix ?? 'Bearer').trim();
            const timeoutSeconds = Number(config.timeout_seconds ?? 15);
            const rawHeaders = config.headers;
            const rawExpectedStatusCodes = config.expected_status_codes;
            const origin = credential.origin?.trim() ?? null;
            const rawToken = credential.token ?? '';
            if (baseUrl === '') {
                throw new Error('api credential base_url is required');
            }
            if (rawToken.trim() === '') {
                throw new Error('api credential token is required');
            }
            const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
                apiCredential: {
                    config: {
                        token: rawToken,
                    },
                },
                keysToDecrypt: ['token'],
                encryptedPrefix: 'enc::',
                strict: true,
            }));
            const decryptedConfig = decryptedDtoOut.apiCredential.config;
            if (!decryptedConfig ||
                typeof decryptedConfig !== 'object' ||
                Array.isArray(decryptedConfig)) {
                throw new Error('api credential decrypted config is invalid');
            }
            const resolvedToken = String(decryptedConfig.token ?? '');
            if (resolvedToken.trim() === '') {
                throw new Error('api credential token could not be decrypted');
            }
            const resolvedUrl = logEndpoint !== ''
                ? `${baseUrl.replace(/\/+$/, '')}/${logEndpoint.replace(/^\/+/, '')}`
                : baseUrl.replace(/\/+$/, '');
            return new build_api_credential_connection_data_dto_out_1.BuildApiCredentialConnectionDataDtoOut(resolvedUrl, resolvedToken, tokenPrefix === '' ? 'Bearer' : tokenPrefix, origin, timeoutSeconds > 0 ? timeoutSeconds : 15, this.parseHeaders(rawHeaders), this.parseExpectedStatusCodes(rawExpectedStatusCodes), credential);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on build api credential connection data';
            throw new Error(message);
        }
    }
    parseHeaders(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        const headers = {};
        for (const [key, headerValue] of Object.entries(value)) {
            if (key.trim() === '') {
                continue;
            }
            headers[key] = String(headerValue);
        }
        return headers;
    }
    parseExpectedStatusCodes(value) {
        const values = Array.isArray(value) ? value : [200, 201];
        return [...new Set(values.map((item) => Number(item)).filter(Boolean))];
    }
};
exports.BuildApiCredentialConnectionDataService = BuildApiCredentialConnectionDataService;
exports.BuildApiCredentialConnectionDataService = BuildApiCredentialConnectionDataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_active_api_credential_by_slug_service_1.FindActiveApiCredentialBySlugService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService])
], BuildApiCredentialConnectionDataService);
//# sourceMappingURL=build-api-credential-connection-data.service.js.map