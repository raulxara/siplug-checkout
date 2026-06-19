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
exports.ReceivePicPayWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalized_payment_webhook_event_dto_1 = require("../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const normalize_picpay_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/picpay/services/normalize-picpay-webhook/dtos/normalize-picpay-webhook.dto-in");
const normalize_picpay_webhook_service_1 = require("../../modules/payment-webhook-gateways/picpay/services/normalize-picpay-webhook/normalize-picpay-webhook.service");
const validate_picpay_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/picpay/services/validate-picpay-webhook/dtos/validate-picpay-webhook.dto-in");
const validate_picpay_webhook_service_1 = require("../../modules/payment-webhook-gateways/picpay/services/validate-picpay-webhook/validate-picpay-webhook.service");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_picpay_webhook_dto_out_1 = require("./dtos/receive-picpay-webhook.dto-out");
let ReceivePicPayWebhookUseCase = class ReceivePicPayWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validatePicPayWebhookService;
    normalizePicPayWebhookService;
    findPaymentTransactionByGatewayTransactionIdService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validatePicPayWebhookService, normalizePicPayWebhookService, findPaymentTransactionByGatewayTransactionIdService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validatePicPayWebhookService = validatePicPayWebhookService;
        this.normalizePicPayWebhookService = normalizePicPayWebhookService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const credentialData = await this.resolveCredentialData(dtoIn.apiCredentialId);
            const validationDtoOut = this.validatePicPayWebhookService.exec(new validate_picpay_webhook_dto_in_1.ValidatePicPayWebhookDtoIn({
                authorization: dtoIn.authorization,
                webhookToken: credentialData.webhookToken,
                authMode: credentialData.authMode,
            }));
            const normalizedDtoOut = this.normalizePicPayWebhookService.exec(new normalize_picpay_webhook_dto_in_1.NormalizePicPayWebhookDtoIn({
                payload: dtoIn.payload,
                headers: dtoIn.headers,
                eventTypeHeader: dtoIn.eventTypeHeader,
            }));
            const normalizedEvent = await this.enrichPicPayNormalizedEventWithInternalReferences(normalizedDtoOut.normalizedEvent);
            const sanitizedPayload = this.sanitizeSensitiveGatewayData(dtoIn.payload);
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
                subscriptionId: null,
                subscriptionInvoiceId: null,
                externalReference: normalizedEvent.externalReference,
                amount: normalizedEvent.amount,
                currency: normalizedEvent.currency,
                headers: normalizedEvent.headers,
                payload: sanitizedPayload,
                normalizedPayload: {
                    provider: normalizedEvent.provider,
                    eventId: normalizedEvent.eventId,
                    eventType: normalizedEvent.eventType,
                    eventAction: normalizedEvent.eventAction,
                    canonicalStatus: normalizedEvent.canonicalStatus,
                    gatewayTransactionId: normalizedEvent.gatewayTransactionId,
                    gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
                    gatewayChargeId: normalizedEvent.gatewayChargeId,
                    gatewaySubscriptionId: null,
                    gatewayInvoiceId: null,
                    paymentTransactionId: normalizedEvent.paymentTransactionId,
                    checkoutSessionId: normalizedEvent.checkoutSessionId,
                    subscriptionId: null,
                    subscriptionInvoiceId: null,
                    externalReference: normalizedEvent.externalReference,
                    amount: normalizedEvent.amount,
                    currency: normalizedEvent.currency,
                },
                metadata: {
                    source: 'ReceivePicPayWebhookUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                    signature: {
                        valid: validationDtoOut.valid,
                        skipped: validationDtoOut.skipped,
                        reason: validationDtoOut.reason,
                    },
                },
                config: null,
            }));
            if (registeredDtoOut.wasAlreadyRegistered) {
                return new receive_picpay_webhook_dto_out_1.ReceivePicPayWebhookDtoOut(registeredDtoOut.paymentWebhookEvent, null, {
                    ignored: true,
                    reason: 'picpay webhook event already registered',
                    eventId: normalizedEvent.eventId,
                }, true);
            }
            const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
                paymentWebhookEventId: String(registeredDtoOut.paymentWebhookEvent._id),
                normalizedEvent,
            }));
            return new receive_picpay_webhook_dto_out_1.ReceivePicPayWebhookDtoOut(processedDtoOut.paymentWebhookEvent, processedDtoOut.paymentTransaction, processedDtoOut.processingResult, false);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceivePicPayWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    payload: this.sanitizeSensitiveGatewayData(dtoIn.payload),
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive picpay webhook use case';
            throw new Error(message);
        }
    }
    async resolveCredentialData(apiCredentialId) {
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        const normalizedProvider = this.normalizeProvider(apiCredential.provider);
        if (normalizedProvider !== 'picpay') {
            throw new Error('api credential provider must be picpay');
        }
        const config = this.toRecordOrNull(apiCredential.config);
        const webhookToken = this.extractString(config, 'webhookToken') ??
            this.extractString(config, 'webhook_token');
        const authMode = this.extractString(config, 'webhookAuthMode') === 'required'
            ? 'required'
            : 'optional';
        if (webhookToken !== null &&
            webhookToken.startsWith('enc::')) {
            const decryptedConfigDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
                apiCredential: {
                    config: {
                        webhookToken,
                    },
                },
                keysToDecrypt: ['webhookToken'],
                strict: true,
            }));
            const decryptedConfig = this.toRecordOrNull(decryptedConfigDtoOut.apiCredential.config);
            return {
                webhookToken: this.extractString(decryptedConfig, 'webhookToken'),
                authMode,
            };
        }
        return {
            webhookToken,
            authMode,
        };
    }
    async enrichPicPayNormalizedEventWithInternalReferences(normalizedEvent) {
        const paymentTransaction = await this.resolvePaymentTransactionFromPicPayEvent(normalizedEvent);
        if (paymentTransaction === null) {
            return normalizedEvent;
        }
        const transactionMetadata = this.toRecordOrNull(paymentTransaction.metadata);
        const transactionConfig = this.toRecordOrNull(paymentTransaction.config);
        const providerPayload = this.toRecordOrNull(paymentTransaction.providerPayload);
        const providerPayloadMetadata = this.toRecordOrNull(providerPayload?.metadata);
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: normalizedEvent.provider,
            eventId: normalizedEvent.eventId,
            eventType: normalizedEvent.eventType,
            eventAction: normalizedEvent.eventAction,
            canonicalStatus: normalizedEvent.canonicalStatus,
            gatewayTransactionId: normalizedEvent.gatewayTransactionId,
            gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
            gatewayChargeId: normalizedEvent.gatewayChargeId,
            gatewaySubscriptionId: null,
            gatewayInvoiceId: null,
            paymentTransactionId: normalizedEvent.paymentTransactionId ??
                this.extractString(paymentTransaction, '_id'),
            checkoutSessionId: normalizedEvent.checkoutSessionId ??
                this.extractString(paymentTransaction, 'checkoutSessionId') ??
                this.extractString(paymentTransaction, 'checkout_session_id') ??
                this.extractString(transactionMetadata, 'checkoutSessionId') ??
                this.extractString(transactionMetadata, 'checkout_session_id') ??
                this.extractString(providerPayloadMetadata, 'checkoutSessionId') ??
                this.extractString(providerPayloadMetadata, 'checkout_session_id'),
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: normalizedEvent.externalReference,
            amount: normalizedEvent.amount,
            currency: normalizedEvent.currency,
            rawPayload: normalizedEvent.rawPayload,
            headers: normalizedEvent.headers,
        });
    }
    async resolvePaymentTransactionFromPicPayEvent(normalizedEvent) {
        const gatewayTransactionIds = [
            normalizedEvent.gatewayTransactionId,
            normalizedEvent.gatewayChargeId,
            normalizedEvent.gatewayPaymentIntentId,
            normalizedEvent.externalReference,
        ].filter((value) => value !== null);
        for (const gatewayTransactionId of gatewayTransactionIds) {
            const paymentTransaction = await this.findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId);
            if (paymentTransaction !== null) {
                return paymentTransaction;
            }
        }
        return null;
    }
    async findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId) {
        try {
            const dtoOut = await this.findPaymentTransactionByGatewayTransactionIdService.exec(new find_payment_transaction_by_gateway_transaction_id_dto_in_1.FindPaymentTransactionByGatewayTransactionIdDtoIn(gatewayTransactionId));
            return dtoOut.paymentTransaction;
        }
        catch {
            return null;
        }
    }
    normalizeProvider(provider) {
        const value = String(provider ?? '').trim().toLowerCase();
        if (['picpay', 'pic-pay', 'pic_pay'].includes(value)) {
            return 'picpay';
        }
        return value;
    }
    sanitizeSensitiveGatewayData(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeSensitiveGatewayData(item));
        }
        if (!value || typeof value !== 'object') {
            return value;
        }
        const sanitized = {};
        for (const [key, item] of Object.entries(value)) {
            const normalizedKey = key.toLowerCase();
            if ([
                'card',
                'token',
                'cardtoken',
                'transparenttoken',
                'encrypted_card',
                'encryptedcard',
                'security_code',
                'cvv',
                'cvc',
                'number',
                'authorization',
            ].includes(normalizedKey)) {
                sanitized[key] = '[REDACTED]';
                continue;
            }
            sanitized[key] = this.sanitizeSensitiveGatewayData(item);
        }
        return sanitized;
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
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.ReceivePicPayWebhookUseCase = ReceivePicPayWebhookUseCase;
exports.ReceivePicPayWebhookUseCase = ReceivePicPayWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_picpay_webhook_service_1.ValidatePicPayWebhookService,
        normalize_picpay_webhook_service_1.NormalizePicPayWebhookService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceivePicPayWebhookUseCase);
//# sourceMappingURL=receive-picpay-webhook.use-case.js.map