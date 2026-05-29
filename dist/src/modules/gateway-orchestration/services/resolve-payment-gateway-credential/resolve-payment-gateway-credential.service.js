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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentGatewayCredentialService = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const api_credentials_tokens_1 = require("../../../api-credentials/tokens/api-credentials.tokens");
const find_gateway_by_unique_id_dto_in_1 = require("../../../gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in");
const find_gateway_by_unique_id_service_1 = require("../../../gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const resolve_payment_gateway_credential_dto_out_1 = require("./dtos/resolve-payment-gateway-credential.dto-out");
let ResolvePaymentGatewayCredentialService = class ResolvePaymentGatewayCredentialService {
    apiCredentialsRepository;
    findGatewayByUniqueIdService;
    decryptApiCredentialSecretService;
    constructor(apiCredentialsRepository, findGatewayByUniqueIdService, decryptApiCredentialSecretService) {
        this.apiCredentialsRepository = apiCredentialsRepository;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
    }
    async exec(dtoIn) {
        try {
            const allApiCredentials = await this.apiCredentialsRepository.getAll();
            const apiCredentials = allApiCredentials.filter((apiCredential) => apiCredential.officeId === dtoIn.officeId);
            const candidates = [];
            for (const apiCredential of apiCredentials) {
                if (apiCredential.status !== 'active') {
                    continue;
                }
                const credentialBelongsToClient = apiCredential.clientId === dtoIn.clientId ||
                    apiCredential.clientId === null;
                if (!credentialBelongsToClient) {
                    continue;
                }
                if (apiCredential.gatewayId === null) {
                    continue;
                }
                if (!this.credentialSupportsPaymentContext(apiCredential, dtoIn)) {
                    continue;
                }
                const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(apiCredential.gatewayId));
                const gateway = gatewayDtoOut.gateway;
                if (gateway.status !== 'active') {
                    continue;
                }
                if (!this.gatewaySupportsPaymentContext(gateway, dtoIn)) {
                    continue;
                }
                candidates.push({
                    apiCredential,
                    gateway,
                    priority: this.resolvePriority(apiCredential.config),
                    isDefault: this.resolveIsDefault(apiCredential.config),
                });
            }
            if (candidates.length === 0) {
                throw new Error('active gateway credential not found for payment context');
            }
            const selected = candidates.sort((a, b) => {
                if (a.isDefault !== b.isDefault) {
                    return a.isDefault ? -1 : 1;
                }
                return a.priority - b.priority;
            })[0];
            const providerRequiresToken = this.providerRequiresToken({
                gatewayProvider: selected.gateway.provider,
                gatewaySlug: selected.gateway.slug,
            });
            let decryptedProviderToken = null;
            if (selected.apiCredential.token !== null &&
                selected.apiCredential.token.trim() !== '') {
                decryptedProviderToken = this.decryptProviderToken(selected.apiCredential.token);
            }
            else if (providerRequiresToken) {
                throw new Error('api credential token is required');
            }
            const connectionData = {
                token: decryptedProviderToken,
                config: selected.apiCredential.config,
                gatewayProvider: selected.gateway.provider,
                gatewaySlug: selected.gateway.slug,
                apiCredentialId: selected.apiCredential._id,
                gatewayId: selected.gateway._id,
            };
            return new resolve_payment_gateway_credential_dto_out_1.ResolvePaymentGatewayCredentialDtoOut(selected.gateway, selected.apiCredential, decryptedProviderToken, connectionData);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on resolve payment gateway credential';
            throw new Error(message);
        }
    }
    credentialSupportsPaymentContext(apiCredential, dtoIn) {
        const config = apiCredential.config ?? {};
        const paymentTypes = this.asStringArray(config.paymentTypes ?? config.payment_types);
        const paymentMethods = this.asStringArray(config.paymentMethods ?? config.payment_methods);
        if (paymentTypes.length > 0 && !paymentTypes.includes(dtoIn.paymentType)) {
            return false;
        }
        if (paymentMethods.length > 0 &&
            !paymentMethods.includes(dtoIn.paymentMethod)) {
            return false;
        }
        return true;
    }
    gatewaySupportsPaymentContext(gateway, dtoIn) {
        const config = gateway.config ?? {};
        if (dtoIn.paymentType === 'one_time' &&
            config.supportsOneTimePayment === false) {
            return false;
        }
        if (dtoIn.paymentType === 'installment' &&
            config.supportsInstallments === false) {
            return false;
        }
        if (dtoIn.paymentType === 'recurring' &&
            config.supportsRecurringPayment === false) {
            return false;
        }
        const supportedPaymentMethods = this.asStringArray(config.supportedPaymentMethods ?? config.supported_payment_methods);
        if (supportedPaymentMethods.length > 0 &&
            !supportedPaymentMethods.includes(dtoIn.paymentMethod)) {
            return false;
        }
        return true;
    }
    decryptProviderToken(encryptedToken) {
        const dtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: {
                    token: encryptedToken,
                },
            },
            keysToDecrypt: ['token'],
            encryptedPrefix: 'enc::',
            strict: true,
        }));
        const config = dtoOut.apiCredential.config;
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
            throw new Error('decrypted api credential config is invalid');
        }
        const token = config.token;
        if (typeof token !== 'string' || token.trim() === '') {
            throw new Error('decrypted api credential token is invalid');
        }
        return token;
    }
    providerRequiresToken(params) {
        const provider = this.normalizeProvider(params.gatewayProvider);
        const slug = this.normalizeProvider(params.gatewaySlug);
        const providersWithoutToken = [
            'infinitepay',
            'infinite_pay',
            'infinitypay',
            'infinity_pay',
            'infinity_pay_checkout',
        ];
        if (providersWithoutToken.includes(provider) ||
            providersWithoutToken.includes(slug)) {
            return false;
        }
        return true;
    }
    normalizeProvider(value) {
        return value
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\./g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
    resolvePriority(config) {
        const value = config?.priority;
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : 999;
        }
        return 999;
    }
    resolveIsDefault(config) {
        return config?.isDefault === true || config?.is_default === true;
    }
    asStringArray(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return value
            .map((item) => String(item).trim())
            .filter((item) => item !== '');
    }
};
exports.ResolvePaymentGatewayCredentialService = ResolvePaymentGatewayCredentialService;
exports.ResolvePaymentGatewayCredentialService = ResolvePaymentGatewayCredentialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(api_credentials_tokens_1.API_CREDENTIALS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService])
], ResolvePaymentGatewayCredentialService);
//# sourceMappingURL=resolve-payment-gateway-credential.service.js.map