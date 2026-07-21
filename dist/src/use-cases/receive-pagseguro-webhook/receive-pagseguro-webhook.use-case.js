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
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const process_subscription_webhook_event_dto_in_1 = require("../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in");
const process_subscription_webhook_event_use_case_1 = require("../process-subscription-webhook-event/process-subscription-webhook-event.use-case");
let ReceivePagSeguroWebhookUseCase = class ReceivePagSeguroWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validatePagSeguroWebhookService;
    normalizePagSeguroWebhookService;
    findPaymentTransactionByGatewayTransactionIdService;
    findPaymentTransactionByUniqueIdService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    processSubscriptionWebhookEventUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validatePagSeguroWebhookService, normalizePagSeguroWebhookService, findPaymentTransactionByGatewayTransactionIdService, findPaymentTransactionByUniqueIdService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, processSubscriptionWebhookEventUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validatePagSeguroWebhookService = validatePagSeguroWebhookService;
        this.normalizePagSeguroWebhookService = normalizePagSeguroWebhookService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.processSubscriptionWebhookEventUseCase = processSubscriptionWebhookEventUseCase;
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
            const enrichedNormalizedEvent = await this.enrichPagSeguroNormalizedEventWithInternalReferences(normalizedDtoOut.normalizedEvent);
            const normalizedEvents = this.buildPagSeguroWebhookEffects({
                originalEvent: enrichedNormalizedEvent,
                payload: dtoIn.payload,
            });
            const sanitizedPayload = this.sanitizeSensitiveGatewayData(dtoIn.payload);
            const processedEffects = [];
            let primaryPaymentWebhookEvent = null;
            let primaryPaymentTransaction = null;
            let wasAlreadyRegistered = false;
            for (const eventToProcess of normalizedEvents) {
                const registeredDtoOut = await this.registerPaymentWebhookEventService.exec(new register_payment_webhook_event_dto_in_1.RegisterPaymentWebhookEventDtoIn({
                    provider: eventToProcess.provider,
                    eventId: eventToProcess.eventId,
                    eventType: eventToProcess.eventType,
                    eventAction: eventToProcess.eventAction,
                    canonicalStatus: eventToProcess.canonicalStatus,
                    gatewayTransactionId: eventToProcess.gatewayTransactionId,
                    gatewayPaymentIntentId: eventToProcess.gatewayPaymentIntentId,
                    gatewayChargeId: eventToProcess.gatewayChargeId,
                    gatewaySubscriptionId: eventToProcess.gatewaySubscriptionId,
                    gatewayInvoiceId: eventToProcess.gatewayInvoiceId,
                    paymentTransactionId: eventToProcess.paymentTransactionId,
                    checkoutSessionId: eventToProcess.checkoutSessionId,
                    subscriptionId: eventToProcess.subscriptionId,
                    subscriptionInvoiceId: eventToProcess.subscriptionInvoiceId,
                    externalReference: eventToProcess.externalReference,
                    amount: eventToProcess.amount,
                    currency: eventToProcess.currency,
                    headers: eventToProcess.headers,
                    payload: sanitizedPayload,
                    normalizedPayload: {
                        provider: eventToProcess.provider,
                        eventId: eventToProcess.eventId,
                        eventType: eventToProcess.eventType,
                        eventAction: eventToProcess.eventAction,
                        canonicalStatus: eventToProcess.canonicalStatus,
                        gatewayTransactionId: eventToProcess.gatewayTransactionId,
                        gatewayPaymentIntentId: eventToProcess.gatewayPaymentIntentId,
                        gatewayChargeId: eventToProcess.gatewayChargeId,
                        gatewaySubscriptionId: eventToProcess.gatewaySubscriptionId,
                        gatewayInvoiceId: eventToProcess.gatewayInvoiceId,
                        paymentTransactionId: eventToProcess.paymentTransactionId,
                        checkoutSessionId: eventToProcess.checkoutSessionId,
                        subscriptionId: eventToProcess.subscriptionId,
                        subscriptionInvoiceId: eventToProcess.subscriptionInvoiceId,
                        externalReference: eventToProcess.externalReference,
                        amount: eventToProcess.amount,
                        currency: eventToProcess.currency,
                    },
                    metadata: {
                        source: 'ReceivePagSeguroWebhookUseCase',
                        apiCredentialId: dtoIn.apiCredentialId,
                        effect: {
                            eventType: eventToProcess.eventType,
                            eventAction: eventToProcess.eventAction,
                            canonicalStatus: eventToProcess.canonicalStatus,
                        },
                        signature: {
                            valid: validationDtoOut.valid,
                            skipped: validationDtoOut.skipped,
                            reason: validationDtoOut.reason,
                        },
                    },
                    config: null,
                }));
                const paymentWebhookEvent = registeredDtoOut.paymentWebhookEvent;
                if (primaryPaymentWebhookEvent === null) {
                    primaryPaymentWebhookEvent = paymentWebhookEvent;
                }
                wasAlreadyRegistered =
                    wasAlreadyRegistered || registeredDtoOut.wasAlreadyRegistered;
                if (registeredDtoOut.wasAlreadyRegistered &&
                    String(paymentWebhookEvent.status) === 'processed') {
                    processedEffects.push({
                        ignored: true,
                        reason: 'pagseguro webhook effect already processed',
                        provider: eventToProcess.provider,
                        eventId: eventToProcess.eventId,
                        eventType: eventToProcess.eventType,
                        eventAction: eventToProcess.eventAction,
                        canonicalStatus: eventToProcess.canonicalStatus,
                    });
                    continue;
                }
                const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();
                if (paymentWebhookEventId === '') {
                    throw new Error('paymentWebhookEvent._id is required');
                }
                const paymentProcessedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
                    paymentWebhookEventId,
                    normalizedEvent: eventToProcess,
                }));
                const subscriptionProcessedDtoOut = await this.processSubscriptionWebhookEventUseCase.exec(new process_subscription_webhook_event_dto_in_1.ProcessSubscriptionWebhookEventDtoIn({
                    paymentWebhookEventId,
                    normalizedEvent: eventToProcess,
                    paymentProcessingResult: paymentProcessedDtoOut.processingResult,
                }));
                if (primaryPaymentTransaction === null &&
                    paymentProcessedDtoOut.paymentTransaction !== null) {
                    primaryPaymentTransaction =
                        paymentProcessedDtoOut.paymentTransaction;
                }
                processedEffects.push({
                    ignored: false,
                    provider: eventToProcess.provider,
                    eventId: eventToProcess.eventId,
                    eventType: eventToProcess.eventType,
                    eventAction: eventToProcess.eventAction,
                    canonicalStatus: eventToProcess.canonicalStatus,
                    paymentProcessingResult: paymentProcessedDtoOut.processingResult,
                    subscriptionProcessingResult: subscriptionProcessedDtoOut.processingResult,
                });
            }
            if (primaryPaymentWebhookEvent === null) {
                throw new Error('pagseguro webhook event was not registered');
            }
            return new receive_pagseguro_webhook_dto_out_1.ReceivePagSeguroWebhookDtoOut(primaryPaymentWebhookEvent, primaryPaymentTransaction, {
                ignored: false,
                provider: 'pagseguro',
                effectsTotal: processedEffects.length,
                effects: processedEffects,
            }, wasAlreadyRegistered);
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
        const paymentTransactionIds = [
            normalizedEvent.paymentTransactionId,
            normalizedEvent.externalReference,
            this.restoreUuidFromCompactString(normalizedEvent.externalReference),
        ].filter((value) => value !== null);
        for (const paymentTransactionId of paymentTransactionIds) {
            const paymentTransaction = await this.findPaymentTransactionByUniqueIdSafe(paymentTransactionId);
            if (paymentTransaction !== null) {
                return paymentTransaction;
            }
        }
        const xProductId = this.extractString(normalizedEvent.headers, 'x-product-id');
        const gatewayTransactionIds = [
            xProductId,
            normalizedEvent.gatewayTransactionId,
            normalizedEvent.gatewayChargeId,
            normalizedEvent.gatewayPaymentIntentId,
            normalizedEvent.gatewayInvoiceId,
        ]
            .filter((value) => value !== null)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const gatewayTransactionId of gatewayTransactionIds) {
            const paymentTransaction = await this.findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId);
            if (paymentTransaction !== null) {
                return paymentTransaction;
            }
        }
        return null;
    }
    buildPagSeguroWebhookEffects(params) {
        const events = [
            params.originalEvent,
        ];
        const paidEffect = this.buildPagSeguroPaidEffectFromSubscriptionWebhook({
            originalEvent: params.originalEvent,
            payload: params.payload,
        });
        if (paidEffect !== null) {
            events.push(paidEffect);
        }
        return events;
    }
    buildPagSeguroPaidEffectFromSubscriptionWebhook(params) {
        if (params.originalEvent.provider !== 'pagseguro') {
            return null;
        }
        if (params.originalEvent.eventType !== 'subscription') {
            return null;
        }
        if (params.originalEvent.canonicalStatus !== 'subscription_active') {
            return null;
        }
        const resource = this.extractObject(params.payload, 'resource');
        if (resource === null) {
            return null;
        }
        const currentInvoice = this.extractObject(resource, 'current_invoice');
        if (currentInvoice === null) {
            return null;
        }
        const invoiceStatus = this.extractString(currentInvoice, 'status');
        const paidAt = this.extractString(currentInvoice, 'paid_at');
        const payments = currentInvoice.payments;
        const approvedPayment = Array.isArray(payments)
            ? payments
                .map((payment) => this.asRecord(payment))
                .find((payment) => {
                const paymentStatus = this.extractString(payment, 'status');
                return paymentStatus === 'APPROVED' || paymentStatus === 'PAID';
            }) ?? null
            : null;
        if (invoiceStatus !== 'PAID' &&
            paidAt === null &&
            approvedPayment === null) {
            return null;
        }
        const invoiceId = this.extractString(currentInvoice, 'id');
        const paymentId = this.extractString(approvedPayment, 'id');
        const amountObject = this.extractObject(currentInvoice, 'amount');
        const amount = this.extractNumber(amountObject, 'value') ?? params.originalEvent.amount;
        const currency = this.extractString(amountObject, 'currency') ??
            params.originalEvent.currency;
        const eventId = [
            params.originalEvent.gatewaySubscriptionId ??
                params.originalEvent.gatewayTransactionId ??
                params.originalEvent.eventId,
            invoiceId ?? 'invoice',
            paymentId ?? 'payment',
            'PAID',
        ].join(':');
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: params.originalEvent.provider,
            eventId,
            eventType: 'subscription_invoice',
            eventAction: 'subscription_invoice.paid',
            canonicalStatus: 'paid',
            gatewayTransactionId: params.originalEvent.gatewayTransactionId ??
                params.originalEvent.gatewaySubscriptionId,
            gatewayPaymentIntentId: paymentId ??
                invoiceId ??
                params.originalEvent.gatewayPaymentIntentId,
            gatewayChargeId: paymentId,
            gatewaySubscriptionId: params.originalEvent.gatewaySubscriptionId,
            gatewayInvoiceId: invoiceId,
            paymentTransactionId: params.originalEvent.paymentTransactionId,
            checkoutSessionId: params.originalEvent.checkoutSessionId,
            subscriptionId: params.originalEvent.subscriptionId,
            subscriptionInvoiceId: params.originalEvent.subscriptionInvoiceId,
            externalReference: params.originalEvent.externalReference,
            amount,
            currency,
            rawPayload: {
                pagseguro: params.payload,
                derivedEffect: {
                    sourceEventId: params.originalEvent.eventId,
                    sourceEventType: params.originalEvent.eventType,
                    sourceEventAction: params.originalEvent.eventAction,
                    sourceCanonicalStatus: params.originalEvent.canonicalStatus,
                    reason: 'PagSeguro subscription.initial contains current_invoice PAID with APPROVED payment',
                    currentInvoice,
                },
            },
            headers: params.originalEvent.headers,
        });
    }
    extractFirstPaymentId(currentInvoice) {
        const payments = currentInvoice.payments;
        if (!Array.isArray(payments)) {
            return null;
        }
        for (const payment of payments) {
            const paymentObject = this.asRecord(payment);
            if (paymentObject === null) {
                continue;
            }
            const paymentId = this.extractString(paymentObject, 'id');
            if (paymentId !== null) {
                return paymentId;
            }
        }
        return null;
    }
    extractObject(object, key) {
        if (object === null) {
            return null;
        }
        return this.asRecord(object[key]);
    }
    asRecord(value) {
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
    extractNumber(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? null : numberValue;
    }
    async findPaymentTransactionByUniqueIdSafe(paymentTransactionId) {
        try {
            const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId));
            return dtoOut.paymentTransaction;
        }
        catch {
            return null;
        }
    }
    restoreUuidFromCompactString(value) {
        if (value === null) {
            return null;
        }
        const normalized = value.trim().toLowerCase();
        if (!/^[a-f0-9]{32}$/.test(normalized)) {
            return null;
        }
        return [
            normalized.slice(0, 8),
            normalized.slice(8, 12),
            normalized.slice(12, 16),
            normalized.slice(16, 20),
            normalized.slice(20),
        ].join('-');
    }
    async delay(milliseconds) {
        await new Promise((resolve) => setTimeout(resolve, milliseconds));
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
};
exports.ReceivePagSeguroWebhookUseCase = ReceivePagSeguroWebhookUseCase;
exports.ReceivePagSeguroWebhookUseCase = ReceivePagSeguroWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_pagseguro_webhook_service_1.ValidatePagSeguroWebhookService,
        normalize_pagseguro_webhook_service_1.NormalizePagSeguroWebhookService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        process_subscription_webhook_event_use_case_1.ProcessSubscriptionWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceivePagSeguroWebhookUseCase);
//# sourceMappingURL=receive-pagseguro-webhook.use-case.js.map