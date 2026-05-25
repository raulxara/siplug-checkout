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
exports.UpdateApiCredentialUseCase = void 0;
const common_1 = require("@nestjs/common");
const encrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/encrypt-api-credential-secret/dtos/encrypt-api-credential-secret.dto-in");
const encrypt_api_credential_secret_service_1 = require("../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalize_api_credential_config_dto_in_1 = require("../../modules/api-credentials/services/normalize-api-credential-config/dtos/normalize-api-credential-config.dto-in");
const normalize_api_credential_config_service_1 = require("../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service");
const update_api_credential_dto_in_1 = require("../../modules/api-credentials/services/update-api-credential/dtos/update-api-credential.dto-in");
const update_api_credential_service_1 = require("../../modules/api-credentials/services/update-api-credential/update-api-credential.service");
const validate_api_credential_slug_uniqueness_dto_in_1 = require("../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/dtos/validate-api-credential-slug-uniqueness.dto-in");
const validate_api_credential_slug_uniqueness_service_1 = require("../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_api_credential_dto_out_1 = require("./dtos/update-api-credential.dto-out");
let UpdateApiCredentialUseCase = class UpdateApiCredentialUseCase {
    resolveActorAuthorizationService;
    findApiCredentialByUniqueIdService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    validateApiCredentialSlugUniquenessService;
    normalizeApiCredentialConfigService;
    encryptApiCredentialSecretService;
    updateApiCredentialService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findApiCredentialByUniqueIdService, findOfficeByUniqueIdService, findClientByUniqueIdService, validateApiCredentialSlugUniquenessService, normalizeApiCredentialConfigService, encryptApiCredentialSecretService, updateApiCredentialService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.validateApiCredentialSlugUniquenessService = validateApiCredentialSlugUniquenessService;
        this.normalizeApiCredentialConfigService = normalizeApiCredentialConfigService;
        this.encryptApiCredentialSecretService = encryptApiCredentialSecretService;
        this.updateApiCredentialService = updateApiCredentialService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updateApiCredential',
                requiredEntity: 'api_credentials',
            }));
            const currentDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId));
            const current = currentDtoOut.apiCredential;
            if (dtoIn.officeId !== null) {
                await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            }
            if (dtoIn.clientId !== null) {
                await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(dtoIn.clientId));
            }
            const effectiveOfficeId = dtoIn.officeId ?? current.officeId;
            const effectiveSlug = dtoIn.slug ?? current.slug;
            const slugChanged = effectiveSlug !== current.slug || effectiveOfficeId !== current.officeId;
            if (slugChanged) {
                await this.validateApiCredentialSlugUniquenessService.exec(new validate_api_credential_slug_uniqueness_dto_in_1.ValidateApiCredentialSlugUniquenessDtoIn({
                    officeId: effectiveOfficeId,
                    slug: effectiveSlug,
                }));
            }
            const encryptedToken = this.encryptProviderTokenIfNeeded(dtoIn.providerToken);
            const encryptedConfig = this.encryptConfigIfNeeded({
                slug: effectiveSlug,
                config: dtoIn.config,
            });
            const updatedDtoOut = await this.updateApiCredentialService.exec(new update_api_credential_dto_in_1.UpdateApiCredentialDtoIn({
                _id: dtoIn.apiCredentialId,
                officeId: dtoIn.officeId,
                clientId: dtoIn.clientId,
                gatewayId: dtoIn.gatewayId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                provider: dtoIn.provider,
                providerType: dtoIn.providerType,
                environment: dtoIn.environment,
                token: encryptedToken,
                origin: dtoIn.origin,
                config: encryptedConfig,
                expiresAt: dtoIn.expiresAt,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            return new update_api_credential_dto_out_1.UpdateApiCredentialDtoOut(this.hideSensitiveToken(updatedDtoOut.apiCredential, encryptedToken !== null));
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdateApiCredentialUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    gatewayId: dtoIn.gatewayId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    provider: dtoIn.provider,
                    providerType: dtoIn.providerType,
                    environment: dtoIn.environment,
                    origin: dtoIn.origin,
                    expiresAt: dtoIn.expiresAt,
                    status: dtoIn.status,
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update api credential use case';
            throw new Error(message);
        }
    }
    encryptProviderTokenIfNeeded(providerToken) {
        if (providerToken === null || providerToken.trim() === '') {
            return null;
        }
        const encryptedTokenDtoOut = this.encryptApiCredentialSecretService.exec(new encrypt_api_credential_secret_dto_in_1.EncryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: {
                    token: providerToken,
                },
            },
            keysToEncrypt: ['token'],
            encryptedPrefix: 'enc::',
            strict: true,
        }));
        const encryptedTokenConfig = encryptedTokenDtoOut.apiCredential.config;
        if (!encryptedTokenConfig ||
            typeof encryptedTokenConfig !== 'object' ||
            Array.isArray(encryptedTokenConfig)) {
            throw new Error('encrypted token config is invalid');
        }
        const encryptedToken = String(encryptedTokenConfig.token ?? '');
        if (encryptedToken.trim() === '') {
            throw new Error('encrypted token is invalid');
        }
        return encryptedToken;
    }
    encryptConfigIfNeeded(params) {
        if (params.config === null) {
            return null;
        }
        const normalizedConfigDtoOut = this.normalizeApiCredentialConfigService.exec(new normalize_api_credential_config_dto_in_1.NormalizeApiCredentialConfigDtoIn({
            slug: params.slug,
            config: params.config,
        }));
        const encryptedConfigDtoOut = this.encryptApiCredentialSecretService.exec(new encrypt_api_credential_secret_dto_in_1.EncryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: normalizedConfigDtoOut.config,
            },
            keysToEncrypt: [
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
                'privateKey',
                'private_key',
                'webhookSecret',
                'webhook_secret',
            ],
            encryptedPrefix: 'enc::',
            strict: false,
        }));
        const encryptedConfig = encryptedConfigDtoOut.apiCredential.config;
        if (!encryptedConfig ||
            typeof encryptedConfig !== 'object' ||
            Array.isArray(encryptedConfig)) {
            throw new Error('encrypted api credential config is invalid');
        }
        return encryptedConfig;
    }
    hideSensitiveToken(apiCredential, tokenUpdated) {
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
            origin: apiCredential.origin,
            config: apiCredential.config,
            expiresAt: apiCredential.expiresAt,
            changesHistory: apiCredential.changesHistory,
            status: apiCredential.status,
            createdAt: apiCredential.createdAt,
            updatedAt: apiCredential.updatedAt,
            tokenUpdated,
        };
    }
};
exports.UpdateApiCredentialUseCase = UpdateApiCredentialUseCase;
exports.UpdateApiCredentialUseCase = UpdateApiCredentialUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        validate_api_credential_slug_uniqueness_service_1.ValidateApiCredentialSlugUniquenessService,
        normalize_api_credential_config_service_1.NormalizeApiCredentialConfigService,
        encrypt_api_credential_secret_service_1.EncryptApiCredentialSecretService,
        update_api_credential_service_1.UpdateApiCredentialService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdateApiCredentialUseCase);
//# sourceMappingURL=update-api-credential.use-case.js.map