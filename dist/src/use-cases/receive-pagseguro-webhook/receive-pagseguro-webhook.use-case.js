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
exports.ReceivePagSeguroWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalize_pagseguro_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/pagseguro/services/normalize-pagseguro-webhook/dtos/normalize-pagseguro-webhook.dto-in");
const normalize_pagseguro_webhook_service_1 = require("../../modules/payment-webhook-gateways/pagseguro/services/normalize-pagseguro-webhook/normalize-pagseguro-webhook.service");
const validate_pagseguro_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/dtos/validate-pagseguro-webhook.dto-in");
const validate_pagseguro_webhook_service_1 = require("../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_pagseguro_webhook_dto_out_1 = require("./dtos/receive-pagseguro-webhook.dto-out");
const normalized_payment_webhook_event_dto_1 = require("../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
let ReceivePagSeguroWebhookUseCase = class ReceivePagSeguroWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validatePagSeguroWebhookService;
    normalizePagSeguroWebhookService;
    findPaymentTransactionByGatewayTransactionIdService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validatePagSeguroWebhookService, normalizePagSeguroWebhookService, findPaymentTransactionByGatewayTransactionIdService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validatePagSeguroWebhookService = validatePagSeguroWebhookService;
        this.normalizePagSeguroWebhookService = normalizePagSeguroWebhookService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const credentialData = await this.resolveCredentialData(dtoIn.apiCredentialId);
            const validationDtoOut = this.validatePagSeguroWebhookService.exec(new validate_pagseguro_webhook_dto_in_1.ValidatePagSeguroWebhookDtoIn({
                rawBody: dtoIn.rawBody,
                token: credentialData.token,
                xAuthenticityToken: dtoIn.xAuthenticityToken,
                signatureMode: credentialData.signatureMode,
            }));
            const normalizedDtoOut = this.normalizePagSeguroWebhookService.exec(new normalize_pagseguro_webhook_dto_in_1.NormalizePagSeguroWebhookDtoIn({
                payload: dtoIn.payload,
                headers: dtoIn.headers,
            }));
            const normalizedEvent = await this.enrichPagSeguroNormalizedEventWithInternalReferences(normalizedDtoOut.normalizedEvent);
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
                subscriptionId: normalizedEvent.subscriptionId,
                subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
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
                    source: 'ReceivePagSeguroWebhookUseCase',
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
                return new receive_pagseguro_webhook_dto_out_1.ReceivePagSeguroWebhookDtoOut(registeredDtoOut.paymentWebhookEvent, null, {
                    ignored: true,
                    reason: 'pagseguro webhook event already registered',
                    eventId: normalizedEvent.eventId,
                }, true);
            }
            const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
                paymentWebhookEventId: String(registeredDtoOut.paymentWebhookEvent._id),
                normalizedEvent,
            }));
            return new receive_pagseguro_webhook_dto_out_1.ReceivePagSeguroWebhookDtoOut(processedDtoOut.paymentWebhookEvent, processedDtoOut.paymentTransaction, processedDtoOut.processingResult, false);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceivePagSeguroWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    payload: this.sanitizeSensitiveGatewayData(dtoIn.payload),
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive pagseguro webhook use case';
            throw new Error(message);
        }
    }
    async enrichPagSeguroNormalizedEventWithInternalReferences(normalizedEvent) {
        const paymentTransaction = await this.resolvePaymentTransactionFromPagSeguroEvent(normalizedEvent);
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
            gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
            gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,
            paymentTransactionId: normalizedEvent.paymentTransactionId ??
                this.extractString(paymentTransaction, '_id'),
            checkoutSessionId: normalizedEvent.checkoutSessionId ??
                this.extractString(paymentTransaction, 'checkoutSessionId') ??
                this.extractString(paymentTransaction, 'checkout_session_id') ??
                this.extractString(transactionMetadata, 'checkoutSessionId') ??
                this.extractString(transactionMetadata, 'checkout_session_id') ??
                this.extractString(providerPayloadMetadata, 'checkoutSessionId') ??
                this.extractString(providerPayloadMetadata, 'checkout_session_id'),
            subscriptionId: normalizedEvent.subscriptionId ??
                this.extractString(paymentTransaction, 'subscriptionId') ??
                this.extractString(paymentTransaction, 'subscription_id') ??
                this.extractString(transactionMetadata, 'subscriptionId') ??
                this.extractString(transactionMetadata, 'subscription_id') ??
                this.extractString(transactionConfig, 'subscriptionId') ??
                this.extractString(transactionConfig, 'subscription_id') ??
                this.extractString(providerPayloadMetadata, 'subscriptionId') ??
                this.extractString(providerPayloadMetadata, 'subscription_id'),
            subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId ??
                this.extractString(paymentTransaction, 'subscriptionInvoiceId') ??
                this.extractString(paymentTransaction, 'subscription_invoice_id') ??
                this.extractString(transactionMetadata, 'subscriptionInvoiceId') ??
                this.extractString(transactionMetadata, 'subscription_invoice_id') ??
                this.extractString(transactionConfig, 'subscriptionInvoiceId') ??
                this.extractString(transactionConfig, 'subscription_invoice_id') ??
                this.extractString(providerPayloadMetadata, 'subscriptionInvoiceId') ??
                this.extractString(providerPayloadMetadata, 'subscription_invoice_id'),
            externalReference: normalizedEvent.externalReference,
            amount: normalizedEvent.amount,
            currency: normalizedEvent.currency,
            rawPayload: normalizedEvent.rawPayload,
            headers: normalizedEvent.headers,
        });
    }
    async resolvePaymentTransactionFromPagSeguroEvent(normalizedEvent) {
        const gatewayTransactionIds = [
            normalizedEvent.gatewayTransactionId,
            normalizedEvent.gatewayChargeId,
            normalizedEvent.gatewayPaymentIntentId,
            normalizedEvent.gatewayInvoiceId,
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
    async resolveCredentialData(apiCredentialId) {
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        const normalizedProvider = this.normalizeProvider(apiCredential.provider);
        if (normalizedProvider !== 'pagseguro') {
            throw new Error('api credential provider must be pagseguro');
        }
        if (apiCredential.token === null || apiCredential.token.trim() === '') {
            throw new Error('PagSeguro api credential token is required');
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
        const tokenConfig = this.toRecordOrNull(decryptedTokenDtoOut.apiCredential.config);
        const token = this.extractString(tokenConfig, 'token');
        if (token === null) {
            throw new Error('PagSeguro decrypted token is required');
        }
        const config = this.toRecordOrNull(apiCredential.config);
        const signatureMode = this.extractString(config, 'webhookSignatureMode') === 'required'
            ? 'required'
            : 'optional';
        return {
            token,
            signatureMode,
        };
    }
    normalizeProvider(provider) {
        const value = String(provider ?? '').trim().toLowerCase();
        if (['pagseguro', 'pag-bank', 'pagbank', 'pag_seguro'].includes(value)) {
            return 'pagseguro';
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
                'encrypted_card',
                'encryptedcard',
                'security_code',
                'cvv',
                'cvc',
                'number',
                'holder',
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
exports.ReceivePagSeguroWebhookUseCase = ReceivePagSeguroWebhookUseCase;
exports.ReceivePagSeguroWebhookUseCase = ReceivePagSeguroWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_pagseguro_webhook_service_1.ValidatePagSeguroWebhookService,
        normalize_pagseguro_webhook_service_1.NormalizePagSeguroWebhookService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceivePagSeguroWebhookUseCase);
//# sourceMappingURL=receive-pagseguro-webhook.use-case.js.map