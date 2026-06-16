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
exports.ReceiveMercadoPagoWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const get_mercado_pago_payment_dto_in_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/dtos/get-mercado-pago-payment.dto-in");
const get_mercado_pago_payment_service_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service");
const normalize_mercado_pago_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/normalize-mercado-pago-webhook/dtos/normalize-mercado-pago-webhook.dto-in");
const normalize_mercado_pago_webhook_service_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/normalize-mercado-pago-webhook/normalize-mercado-pago-webhook.service");
const validate_mercado_pago_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/validate-mercado-pago-webhook/dtos/validate-mercado-pago-webhook.dto-in");
const validate_mercado_pago_webhook_service_1 = require("../../modules/payment-webhook-gateways/mercado-pago/services/validate-mercado-pago-webhook/validate-mercado-pago-webhook.service");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_mercado_pago_webhook_dto_out_1 = require("./dtos/receive-mercado-pago-webhook.dto-out");
let ReceiveMercadoPagoWebhookUseCase = class ReceiveMercadoPagoWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validateMercadoPagoWebhookService;
    getMercadoPagoPaymentService;
    normalizeMercadoPagoWebhookService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validateMercadoPagoWebhookService, getMercadoPagoPaymentService, normalizeMercadoPagoWebhookService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validateMercadoPagoWebhookService = validateMercadoPagoWebhookService;
        this.getMercadoPagoPaymentService = getMercadoPagoPaymentService;
        this.normalizeMercadoPagoWebhookService = normalizeMercadoPagoWebhookService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const credentialData = await this.resolveCredentialData(dtoIn.apiCredentialId);
            const paymentId = this.resolvePaymentId({
                payload: dtoIn.payload,
                queryParams: dtoIn.queryParams,
            });
            await this.validateMercadoPagoWebhookService.exec(new validate_mercado_pago_webhook_dto_in_1.ValidateMercadoPagoWebhookDtoIn({
                xSignature: dtoIn.xSignature,
                xRequestId: dtoIn.xRequestId,
                dataId: this.resolveSignatureDataId(dtoIn.queryParams),
                webhookSecret: credentialData.webhookSecret,
            }));
            const paymentDtoOut = await this.getMercadoPagoPaymentService.exec(new get_mercado_pago_payment_dto_in_1.GetMercadoPagoPaymentDtoIn({
                paymentId,
                accessToken: credentialData.accessToken,
            }));
            const normalizedDtoOut = this.normalizeMercadoPagoWebhookService.exec(new normalize_mercado_pago_webhook_dto_in_1.NormalizeMercadoPagoWebhookDtoIn({
                payload: dtoIn.payload,
                payment: paymentDtoOut.payment,
                headers: dtoIn.headers,
                queryParams: dtoIn.queryParams,
            }));
            const normalizedEvent = normalizedDtoOut.normalizedEvent;
            const registeredDtoOut = await this.registerPaymentWebhookEventService.exec(new register_payment_webhook_event_dto_in_1.RegisterPaymentWebhookEventDtoIn({
                provider: normalizedEvent.provider,
                eventId: normalizedEvent.eventId,
                eventType: normalizedEvent.eventType,
                eventAction: normalizedEvent.eventAction,
                canonicalStatus: normalizedEvent.canonicalStatus,
                gatewayTransactionId: normalizedEvent.gatewayTransactionId,
                gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
                gatewayChargeId: normalizedEvent.gatewayChargeId,
                gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
                gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,
                paymentTransactionId: normalizedEvent.paymentTransactionId,
                checkoutSessionId: normalizedEvent.checkoutSessionId,
                subscriptionId: normalizedEvent.subscriptionId,
                subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
                externalReference: normalizedEvent.externalReference,
                amount: normalizedEvent.amount,
                currency: normalizedEvent.currency,
                headers: normalizedEvent.headers,
                payload: {
                    notification: dtoIn.payload,
                    payment: paymentDtoOut.payment,
                    providerResponse: paymentDtoOut.providerResponse,
                },
                normalizedPayload: {
                    provider: normalizedEvent.provider,
                    eventId: normalizedEvent.eventId,
                    eventType: normalizedEvent.eventType,
                    eventAction: normalizedEvent.eventAction,
                    canonicalStatus: normalizedEvent.canonicalStatus,
                    gatewayTransactionId: normalizedEvent.gatewayTransactionId,
                    gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
                    gatewayChargeId: normalizedEvent.gatewayChargeId,
                    gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
                    gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,
                    paymentTransactionId: normalizedEvent.paymentTransactionId,
                    checkoutSessionId: normalizedEvent.checkoutSessionId,
                    subscriptionId: normalizedEvent.subscriptionId,
                    subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
                    externalReference: normalizedEvent.externalReference,
                    amount: normalizedEvent.amount,
                    currency: normalizedEvent.currency,
                },
                metadata: {
                    source: 'ReceiveMercadoPagoWebhookUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                    mercadoPagoPaymentId: paymentId,
                },
                config: null,
            }));
            if (registeredDtoOut.wasAlreadyRegistered) {
                return new receive_mercado_pago_webhook_dto_out_1.ReceiveMercadoPagoWebhookDtoOut(registeredDtoOut.paymentWebhookEvent, null, {
                    ignored: true,
                    reason: 'mercado pago webhook event already registered',
                    paymentId,
                }, true);
            }
            const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
                paymentWebhookEventId: String(registeredDtoOut.paymentWebhookEvent._id),
                normalizedEvent,
            }));
            return new receive_mercado_pago_webhook_dto_out_1.ReceiveMercadoPagoWebhookDtoOut(processedDtoOut.paymentWebhookEvent, processedDtoOut.paymentTransaction, processedDtoOut.processingResult, false);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceiveMercadoPagoWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    payload: dtoIn.payload,
                    queryParams: dtoIn.queryParams,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive mercado pago webhook use case';
            throw new Error(message);
        }
    }
    async resolveCredentialData(apiCredentialId) {
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        const normalizedCredentialProvider = this.normalizeProvider(apiCredential.provider);
        if (normalizedCredentialProvider !== 'mercado_pago') {
            throw new Error('api credential provider must be mercado_pago');
        }
        const decryptedTokenDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: {
                    token: apiCredential.token,
                },
            },
            keysToDecrypt: ['token'],
            strict: true,
        }));
        const decryptedConfigDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: apiCredential.config,
            },
            keysToDecrypt: [
                'webhookSecret',
                'webhook_secret',
                'secret',
                'accessToken',
                'access_token',
            ],
            strict: false,
        }));
        const tokenConfig = this.toRecordOrNull(decryptedTokenDtoOut.apiCredential.config);
        const config = this.toRecordOrNull(decryptedConfigDtoOut.apiCredential.config);
        const accessToken = this.extractString(tokenConfig, 'token') ??
            this.extractString(config, 'accessToken') ??
            this.extractString(config, 'access_token');
        const webhookSecret = this.extractString(config, 'webhookSecret') ??
            this.extractString(config, 'webhook_secret') ??
            this.extractString(config, 'secret');
        if (accessToken === null) {
            throw new Error('Mercado Pago access token is required');
        }
        if (webhookSecret === null) {
            throw new Error('Mercado Pago webhookSecret is required in api credential config');
        }
        return {
            accessToken,
            webhookSecret,
        };
    }
    resolvePaymentId(params) {
        const queryDataId = this.extractString(params.queryParams, 'data.id');
        const queryId = this.extractString(params.queryParams, 'id');
        if (queryDataId !== null) {
            return queryDataId;
        }
        if (queryId !== null) {
            return queryId;
        }
        const queryData = this.extractObject(params.queryParams, 'data');
        const queryDataObjectId = this.extractString(queryData, 'id');
        if (queryDataObjectId !== null) {
            return queryDataObjectId;
        }
        const bodyData = this.extractObject(params.payload, 'data');
        const bodyDataId = this.extractString(bodyData, 'id');
        if (bodyDataId !== null) {
            return bodyDataId;
        }
        throw new Error('Mercado Pago payment id was not found in webhook');
    }
    extractObject(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
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
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    resolveSignatureDataId(queryParams) {
        const direct = this.extractString(queryParams, 'data.id') ??
            this.extractString(queryParams, 'id');
        if (direct !== null) {
            return direct;
        }
        const data = this.extractObject(queryParams, 'data');
        return this.extractString(data, 'id');
    }
    normalizeProvider(provider) {
        const value = String(provider ?? '').trim().toLowerCase();
        if (['mercadopago', 'mercado-pago', 'mercado_pago'].includes(value)) {
            return 'mercado_pago';
        }
        return value;
    }
    toRecordOrNull(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.ReceiveMercadoPagoWebhookUseCase = ReceiveMercadoPagoWebhookUseCase;
exports.ReceiveMercadoPagoWebhookUseCase = ReceiveMercadoPagoWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_mercado_pago_webhook_service_1.ValidateMercadoPagoWebhookService,
        get_mercado_pago_payment_service_1.GetMercadoPagoPaymentService,
        normalize_mercado_pago_webhook_service_1.NormalizeMercadoPagoWebhookService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceiveMercadoPagoWebhookUseCase);
//# sourceMappingURL=receive-mercado-pago-webhook.use-case.js.map