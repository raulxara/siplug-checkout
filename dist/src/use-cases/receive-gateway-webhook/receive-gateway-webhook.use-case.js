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
exports.ReceiveGatewayWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const fetch_mercado_pago_payment_dto_in_1 = require("../../modules/gateway-orchestration/services/fetch-mercado-pago-payment/dtos/fetch-mercado-pago-payment.dto-in");
const fetch_mercado_pago_payment_service_1 = require("../../modules/gateway-orchestration/services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const receive_gateway_webhook_dto_out_1 = require("./dtos/receive-gateway-webhook.dto-out");
let ReceiveGatewayWebhookUseCase = class ReceiveGatewayWebhookUseCase {
    findPaymentTransactionByGatewayTransactionIdService;
    updatePaymentTransactionService;
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    fetchMercadoPagoPaymentService;
    updateCheckoutSessionService;
    handleUseCaseExceptionService;
    constructor(findPaymentTransactionByGatewayTransactionIdService, updatePaymentTransactionService, findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, fetchMercadoPagoPaymentService, updateCheckoutSessionService, handleUseCaseExceptionService) {
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.fetchMercadoPagoPaymentService = fetchMercadoPagoPaymentService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const provider = this.normalizeProvider(dtoIn.provider);
            if (!['mercado_pago', 'mercadopago', 'mercado-pago'].includes(provider)) {
                throw new Error('gateway webhook provider not supported');
            }
            const eventType = this.extractEventType(dtoIn);
            const eventAction = this.extractEventAction(dtoIn);
            if (eventType !== null && eventType !== 'payment') {
                return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut(provider, eventType, eventAction, null, true, null, null);
            }
            const gatewayTransactionId = this.extractGatewayTransactionId(dtoIn);
            if (gatewayTransactionId === null) {
                throw new Error('gateway transaction id not found in webhook payload');
            }
            const paymentTransactionDtoOut = await this.findPaymentTransactionByGatewayTransactionIdService.exec(new find_payment_transaction_by_gateway_transaction_id_dto_in_1.FindPaymentTransactionByGatewayTransactionIdDtoIn(gatewayTransactionId));
            const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;
            if (paymentTransaction.apiCredentialId === null) {
                throw new Error('payment transaction api credential is required');
            }
            const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(paymentTransaction.apiCredentialId));
            const apiCredential = apiCredentialDtoOut.apiCredential;
            const webhookSecret = this.resolveWebhookSecret(apiCredential.config);
            if (webhookSecret !== null) {
                this.validateMercadoPagoSignature({
                    dtoIn,
                    secret: webhookSecret,
                    gatewayTransactionId,
                });
            }
            if (apiCredential.token === null || apiCredential.token.trim() === '') {
                throw new Error('api credential token is required');
            }
            const providerToken = this.decryptProviderToken(apiCredential.token);
            const fetchedPaymentDtoOut = await this.fetchMercadoPagoPaymentService.exec(new fetch_mercado_pago_payment_dto_in_1.FetchMercadoPagoPaymentDtoIn({
                accessToken: providerToken,
                paymentId: gatewayTransactionId,
            }));
            const updatedPaymentTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                gatewayTransactionId: fetchedPaymentDtoOut.gatewayTransactionId ??
                    paymentTransaction.gatewayTransactionId,
                gatewayStatus: fetchedPaymentDtoOut.gatewayStatus,
                status: fetchedPaymentDtoOut.status,
                processStatus: fetchedPaymentDtoOut.processStatus,
                processMessage: fetchedPaymentDtoOut.processMessage,
                providerResponse: fetchedPaymentDtoOut.providerResponse,
                gatewayResponse: {
                    ...fetchedPaymentDtoOut.gatewayResponse,
                    webhook: {
                        provider,
                        eventType,
                        eventAction,
                        receivedBody: dtoIn.body,
                        receivedQuery: dtoIn.query,
                    },
                },
                qrCode: fetchedPaymentDtoOut.qrCode,
                qrCodeBase64: fetchedPaymentDtoOut.qrCodeBase64,
                checkoutUrl: fetchedPaymentDtoOut.checkoutUrl,
                paidAt: fetchedPaymentDtoOut.paidAt,
                authorizedAt: fetchedPaymentDtoOut.authorizedAt,
                canceledAt: fetchedPaymentDtoOut.canceledAt,
                failedAt: fetchedPaymentDtoOut.failedAt,
                refundedAt: fetchedPaymentDtoOut.refundedAt,
                expiresAt: fetchedPaymentDtoOut.expiresAt,
                source: 'ReceiveGatewayWebhookUseCase',
            }));
            let updatedCheckoutSession = null;
            if (paymentTransaction.checkoutSessionId !== null) {
                const checkoutStatus = this.resolveCheckoutSessionStatus(fetchedPaymentDtoOut.status);
                const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                    _id: paymentTransaction.checkoutSessionId,
                    status: checkoutStatus,
                    source: 'ReceiveGatewayWebhookUseCase',
                }));
                updatedCheckoutSession =
                    updatedCheckoutSessionDtoOut.checkoutSession;
            }
            return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut(provider, eventType, eventAction, gatewayTransactionId, false, updatedPaymentTransactionDtoOut.paymentTransaction, updatedCheckoutSession);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceiveGatewayWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    provider: dtoIn.provider,
                    eventType: this.extractEventType(dtoIn),
                    eventAction: this.extractEventAction(dtoIn),
                    gatewayTransactionId: this.extractGatewayTransactionId(dtoIn),
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive gateway webhook use case';
            throw new Error(message);
        }
    }
    extractGatewayTransactionId(dtoIn) {
        const bodyData = this.asObject(dtoIn.body.data);
        const directId = this.toNullableString(bodyData.id) ??
            this.toNullableString(dtoIn.body.id) ??
            this.toNullableString(dtoIn.query['data.id']) ??
            this.toNullableString(dtoIn.query.id);
        if (directId !== null) {
            return directId;
        }
        const resource = this.toNullableString(dtoIn.body.resource) ??
            this.toNullableString(dtoIn.query.resource);
        if (resource !== null) {
            const parts = resource.split('/').filter((part) => part.trim() !== '');
            const lastPart = parts[parts.length - 1];
            return lastPart ?? null;
        }
        return null;
    }
    extractEventType(dtoIn) {
        return (this.toNullableString(dtoIn.body.type) ??
            this.toNullableString(dtoIn.query.type) ??
            this.toNullableString(dtoIn.query.topic));
    }
    extractEventAction(dtoIn) {
        return this.toNullableString(dtoIn.body.action);
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
    resolveWebhookSecret(config) {
        if (config === null) {
            return null;
        }
        return (this.toNullableString(config.webhookSecret) ??
            this.toNullableString(config.webhook_secret) ??
            this.toNullableString(config.mercadoPagoWebhookSecret) ??
            this.toNullableString(config.mercado_pago_webhook_secret));
    }
    validateMercadoPagoSignature(params) {
        const signatureHeader = this.getHeader(params.dtoIn.headers, 'x-signature');
        const requestId = this.getHeader(params.dtoIn.headers, 'x-request-id');
        if (signatureHeader === null) {
            throw new Error('mercado pago webhook x-signature header is required');
        }
        const signatureParts = this.parseSignatureHeader(signatureHeader);
        const ts = signatureParts.ts;
        const v1 = signatureParts.v1;
        if (ts === null || v1 === null) {
            throw new Error('mercado pago webhook signature is invalid');
        }
        const manifestParts = [];
        const queryDataId = this.toNullableString(params.dtoIn.query['data.id']) ??
            this.toNullableString(params.dtoIn.query.id) ??
            params.gatewayTransactionId;
        if (queryDataId !== null) {
            manifestParts.push(`id:${queryDataId.toLowerCase()};`);
        }
        if (requestId !== null) {
            manifestParts.push(`request-id:${requestId};`);
        }
        manifestParts.push(`ts:${ts};`);
        const manifest = manifestParts.join('');
        const expectedSignature = (0, crypto_1.createHmac)('sha256', params.secret)
            .update(manifest)
            .digest('hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        const receivedBuffer = Buffer.from(v1, 'hex');
        if (expectedBuffer.length !== receivedBuffer.length ||
            !(0, crypto_1.timingSafeEqual)(expectedBuffer, receivedBuffer)) {
            throw new Error('mercado pago webhook signature does not match');
        }
    }
    parseSignatureHeader(signatureHeader) {
        const parts = signatureHeader.split(',');
        let ts = null;
        let v1 = null;
        for (const part of parts) {
            const [key, value] = part.split('=');
            if (key?.trim() === 'ts') {
                ts = value?.trim() ?? null;
            }
            if (key?.trim() === 'v1') {
                v1 = value?.trim() ?? null;
            }
        }
        return { ts, v1 };
    }
    resolveCheckoutSessionStatus(paymentStatus) {
        if (paymentStatus === 'paid') {
            return 'paid';
        }
        if (paymentStatus === 'authorized') {
            return 'authorized';
        }
        if (paymentStatus === 'failed') {
            return 'failed';
        }
        if (paymentStatus === 'canceled') {
            return 'canceled';
        }
        if (paymentStatus === 'refunded') {
            return 'refunded';
        }
        return 'processing';
    }
    getHeader(headers, name) {
        const lowerName = name.toLowerCase();
        for (const [key, value] of Object.entries(headers)) {
            if (key.toLowerCase() === lowerName) {
                return this.toNullableString(value);
            }
        }
        return null;
    }
    normalizeProvider(provider) {
        return provider
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\./g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
    asObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        return value;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.ReceiveGatewayWebhookUseCase = ReceiveGatewayWebhookUseCase;
exports.ReceiveGatewayWebhookUseCase = ReceiveGatewayWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        fetch_mercado_pago_payment_service_1.FetchMercadoPagoPaymentService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceiveGatewayWebhookUseCase);
//# sourceMappingURL=receive-gateway-webhook.use-case.js.map