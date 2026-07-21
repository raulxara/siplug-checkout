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
exports.CreateGatewayCardTokenUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const create_gateway_card_token_dto_out_1 = require("./dtos/create-gateway-card-token.dto-out");
let CreateGatewayCardTokenUseCase = class CreateGatewayCardTokenUseCase {
    findApiCredentialByUniqueIdService;
    constructor(findApiCredentialByUniqueIdService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
    }
    async exec(dtoIn) {
        this.ensureNonProductionEnvironment();
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        const publicKey = this.resolvePublicKey(apiCredential.config);
        const requestPayload = {
            card_number: dtoIn.cardNumber,
            security_code: dtoIn.securityCode,
            expiration_month: dtoIn.expirationMonth,
            expiration_year: dtoIn.expirationYear,
            cardholder: {
                name: dtoIn.cardholderName,
                identification: {
                    type: dtoIn.documentType,
                    number: dtoIn.documentValue,
                },
            },
        };
        const response = await fetch(`https://api.mercadopago.com/v1/card_tokens?public_key=${encodeURIComponent(publicKey)}`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload),
        });
        const responseBody = (await response.json().catch(() => ({
            message: 'Mercado Pago returned a non JSON response',
        })));
        if (!response.ok) {
            throw new Error(this.extractMercadoPagoErrorMessage(responseBody) ??
                `Mercado Pago card token request failed with status ${response.status}`);
        }
        const cardToken = this.toNullableString(responseBody.id);
        if (cardToken === null) {
            throw new Error('Mercado Pago card token was not returned');
        }
        return new create_gateway_card_token_dto_out_1.CreateGatewayCardTokenDtoOut('mercado_pago', cardToken, this.maskPublicKey(publicKey), this.toNullableString(responseBody.first_six_digits), this.toNullableString(responseBody.last_four_digits), this.toNullableNumber(responseBody.expiration_month), this.toNullableNumber(responseBody.expiration_year), responseBody, {
            ok: true,
            httpStatus: response.status,
            endpoint: '/v1/card_tokens',
        });
    }
    ensureNonProductionEnvironment() {
        const nodeEnv = String(process.env.NODE_ENV ?? '').toLowerCase();
        const appEnv = String(process.env.APP_ENV ?? '').toLowerCase();
        const isProduction = nodeEnv === 'production' ||
            appEnv === 'production' ||
            appEnv === 'prod';
        if (isProduction) {
            throw new Error('temporary card token endpoint is not allowed in production');
        }
    }
    resolvePublicKey(config) {
        if (config === null) {
            throw new Error('api credential config is required');
        }
        const publicKey = this.toNullableString(config.publicKey) ??
            this.toNullableString(config.public_key) ??
            this.toNullableString(config.mercadoPagoPublicKey) ??
            this.toNullableString(config.mercado_pago_public_key);
        if (publicKey === null) {
            throw new Error('Mercado Pago publicKey is required in api credential config');
        }
        return publicKey;
    }
    extractMercadoPagoErrorMessage(responseBody) {
        const message = this.toNullableString(responseBody.message);
        if (message !== null) {
            return message;
        }
        const error = this.toNullableString(responseBody.error);
        if (error !== null) {
            return error;
        }
        const cause = responseBody.cause;
        if (Array.isArray(cause) && cause.length > 0) {
            const firstCause = cause[0];
            return (this.toNullableString(firstCause.description) ??
                this.toNullableString(firstCause.message) ??
                this.toNullableString(firstCause.code));
        }
        return null;
    }
    maskPublicKey(publicKey) {
        if (publicKey.length <= 12) {
            return null;
        }
        return `${publicKey.slice(0, 8)}...${publicKey.slice(-4)}`;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableNumber(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim() !== '') {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
    }
};
exports.CreateGatewayCardTokenUseCase = CreateGatewayCardTokenUseCase;
exports.CreateGatewayCardTokenUseCase = CreateGatewayCardTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService])
], CreateGatewayCardTokenUseCase);
//# sourceMappingURL=create-gateway-card-token.use-case.js.map