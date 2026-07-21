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
exports.RegisterApiCredentialUseCase = void 0;
const common_1 = require("@nestjs/common");
const encrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/encrypt-api-credential-secret/dtos/encrypt-api-credential-secret.dto-in");
const encrypt_api_credential_secret_service_1 = require("../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const create_api_credential_dto_in_1 = require("../../modules/api-credentials/services/create-api-credential/dtos/create-api-credential.dto-in");
const create_api_credential_service_1 = require("../../modules/api-credentials/services/create-api-credential/create-api-credential.service");
const normalize_api_credential_config_dto_in_1 = require("../../modules/api-credentials/services/normalize-api-credential-config/dtos/normalize-api-credential-config.dto-in");
const normalize_api_credential_config_service_1 = require("../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service");
const validate_api_credential_slug_uniqueness_dto_in_1 = require("../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/dtos/validate-api-credential-slug-uniqueness.dto-in");
const validate_api_credential_slug_uniqueness_service_1 = require("../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_api_credential_dto_out_1 = require("./dtos/register-api-credential.dto-out");
let RegisterApiCredentialUseCase = class RegisterApiCredentialUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    validateApiCredentialSlugUniquenessService;
    normalizeApiCredentialConfigService;
    encryptApiCredentialSecretService;
    createApiCredentialService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, findClientByUniqueIdService, validateApiCredentialSlugUniquenessService, normalizeApiCredentialConfigService, encryptApiCredentialSecretService, createApiCredentialService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.validateApiCredentialSlugUniquenessService = validateApiCredentialSlugUniquenessService;
        this.normalizeApiCredentialConfigService = normalizeApiCredentialConfigService;
        this.encryptApiCredentialSecretService = encryptApiCredentialSecretService;
        this.createApiCredentialService = createApiCredentialService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerApiCredential',
                requiredEntity: 'api_credentials',
            }));
            if (dtoIn.officeId !== null) {
                await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            }
            if (dtoIn.clientId !== null) {
                await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(dtoIn.clientId));
            }
            await this.validateApiCredentialSlugUniquenessService.exec(new validate_api_credential_slug_uniqueness_dto_in_1.ValidateApiCredentialSlugUniquenessDtoIn({
                officeId: dtoIn.officeId,
                slug: dtoIn.slug,
            }));
            const normalizedConfigDtoOut = this.normalizeApiCredentialConfigService.exec(new normalize_api_credential_config_dto_in_1.NormalizeApiCredentialConfigDtoIn({
                slug: dtoIn.slug,
                config: dtoIn.config,
            }));
            const encryptedTokenDtoOut = this.encryptApiCredentialSecretService.exec(new encrypt_api_credential_secret_dto_in_1.EncryptApiCredentialSecretDtoIn({
                apiCredential: {
                    config: {
                        token: dtoIn.providerToken,
                    },
                },
                keysToEncrypt: ['token'],
                encryptedPrefix: 'enc::',
                strict: true,
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
            const encryptedConfig = encryptedConfigDtoOut.apiCredential.config;
            if (!encryptedConfig ||
                typeof encryptedConfig !== 'object' ||
                Array.isArray(encryptedConfig)) {
                throw new Error('encrypted api credential config is invalid');
            }
            const created = await this.createApiCredentialService.exec(new create_api_credential_dto_in_1.CreateApiCredentialDtoIn({
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
            }));
            return register_api_credential_dto_out_1.RegisterApiCredentialDtoOut.fromCreateApiCredentialDtoOut(created);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterApiCredentialUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    gatewayId: dtoIn.gatewayId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    provider: dtoIn.provider,
                    providerType: dtoIn.providerType,
                    environment: dtoIn.environment,
                    origin: dtoIn.origin,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register api credential use case';
            throw new Error(message);
        }
    }
};
exports.RegisterApiCredentialUseCase = RegisterApiCredentialUseCase;
exports.RegisterApiCredentialUseCase = RegisterApiCredentialUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        validate_api_credential_slug_uniqueness_service_1.ValidateApiCredentialSlugUniquenessService,
        normalize_api_credential_config_service_1.NormalizeApiCredentialConfigService,
        encrypt_api_credential_secret_service_1.EncryptApiCredentialSecretService,
        create_api_credential_service_1.CreateApiCredentialService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterApiCredentialUseCase);
//# sourceMappingURL=register-api-credential.use-case.js.map