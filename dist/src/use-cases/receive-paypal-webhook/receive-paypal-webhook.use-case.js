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
exports.ReceivePayPalWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalize_paypal_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/paypal/services/normalize-paypal-webhook/dtos/normalize-paypal-webhook.dto-in");
const normalize_paypal_webhook_service_1 = require("../../modules/payment-webhook-gateways/paypal/services/normalize-paypal-webhook/normalize-paypal-webhook.service");
const validate_paypal_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/paypal/services/validate-paypal-webhook/dtos/validate-paypal-webhook.dto-in");
const validate_paypal_webhook_service_1 = require("../../modules/payment-webhook-gateways/paypal/services/validate-paypal-webhook/validate-paypal-webhook.service");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_paypal_webhook_dto_out_1 = require("./dtos/receive-paypal-webhook.dto-out");
const normalized_payment_webhook_event_dto_1 = require("../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const capture_paypal_order_return_dto_in_1 = require("../capture-paypal-order-return/dtos/capture-paypal-order-return.dto-in");
const capture_paypal_order_return_use_case_1 = require("../capture-paypal-order-return/capture-paypal-order-return.use-case");
const process_subscription_webhook_event_dto_in_1 = require("../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in");
const process_subscription_webhook_event_use_case_1 = require("../process-subscription-webhook-event/process-subscription-webhook-event.use-case");
let ReceivePayPalWebhookUseCase = class ReceivePayPalWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validatePayPalWebhookService;
    normalizePayPalWebhookService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    processSubscriptionWebhookEventUseCase;
    findPaymentTransactionByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    capturePayPalOrderReturnUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validatePayPalWebhookService, normalizePayPalWebhookService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, processSubscriptionWebhookEventUseCase, findPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService, capturePayPalOrderReturnUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validatePayPalWebhookService = validatePayPalWebhookService;
        this.normalizePayPalWebhookService = normalizePayPalWebhookService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.processSubscriptionWebhookEventUseCase = processSubscriptionWebhookEventUseCase;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.capturePayPalOrderReturnUseCase = capturePayPalOrderReturnUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const credentialData = await this.resolveCredentialData(dtoIn.apiCredentialId);
            const accessToken = await this.createAccessToken(credentialData);
            const validationDtoOut = await this.validatePayPalWebhookService.exec(new validate_paypal_webhook_dto_in_1.ValidatePayPalWebhookDtoIn({
                baseUrl: credentialData.baseUrl,
                accessToken,
                webhookId: credentialData.webhookId,
                authMode: credentialData.webhookAuthMode,
                payload: dtoIn.payload,
                headers: dtoIn.headers,
            }));
            const normalizedDtoOut = this.normalizePayPalWebhookService.exec(new normalize_paypal_webhook_dto_in_1.NormalizePayPalWebhookDtoIn({
                payload: dtoIn.payload,
                headers: dtoIn.headers,
            }));
            const normalizedEvent = await this.enrichNormalizedEventWithPaymentTransactionData(normalizedDtoOut.normalizedEvent);
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
                payload: normalizedEvent.rawPayload,
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
                    source: 'ReceivePayPalWebhookUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                    signature: {
                        valid: validationDtoOut.valid,
                        skipped: validationDtoOut.skipped,
                        reason: validationDtoOut.reason,
                    },
                },
                config: null,
            }));
            const paymentWebhookEvent = registeredDtoOut.paymentWebhookEvent;
            if (registeredDtoOut.wasAlreadyRegistered &&
                String(paymentWebhookEvent.status) === 'processed') {
                return new receive_paypal_webhook_dto_out_1.ReceivePayPalWebhookDtoOut(paymentWebhookEvent, null, {
                    ignored: true,
                    reason: 'webhook event already processed',
                    provider: normalizedEvent.provider,
                    eventId: normalizedEvent.eventId,
                }, true);
            }
            const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();
            if (paymentWebhookEventId === '') {
                throw new Error('paymentWebhookEvent._id is required');
            }
            const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
                paymentWebhookEventId,
                normalizedEvent,
            }));
            const subscriptionProcessedDtoOut = await this.processSubscriptionWebhookEventUseCase.exec(new process_subscription_webhook_event_dto_in_1.ProcessSubscriptionWebhookEventDtoIn({
                paymentWebhookEventId,
                normalizedEvent,
                paymentTransaction: processedDtoOut.paymentTransaction,
                paymentProcessingResult: processedDtoOut.processingResult,
            }));
            const autoCaptureDtoOut = await this.autoCaptureApprovedPayPalOrderIfNeeded({
                apiCredentialId: dtoIn.apiCredentialId,
                normalizedEvent,
            });
            if (autoCaptureDtoOut !== null) {
                return new receive_paypal_webhook_dto_out_1.ReceivePayPalWebhookDtoOut(autoCaptureDtoOut.paymentWebhookEvent, autoCaptureDtoOut.paymentTransaction, {
                    sourceWebhook: {
                        paymentProcessingResult: processedDtoOut.processingResult,
                        subscriptionProcessingResult: subscriptionProcessedDtoOut.processingResult,
                    },
                    autoCapture: autoCaptureDtoOut.processingResult,
                }, registeredDtoOut.wasAlreadyRegistered);
            }
            return new receive_paypal_webhook_dto_out_1.ReceivePayPalWebhookDtoOut(subscriptionProcessedDtoOut.paymentWebhookEvent, subscriptionProcessedDtoOut.paymentTransaction ??
                processedDtoOut.paymentTransaction, {
                paymentProcessingResult: processedDtoOut.processingResult,
                subscriptionProcessingResult: subscriptionProcessedDtoOut.processingResult,
            }, registeredDtoOut.wasAlreadyRegistered);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceivePayPalWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    provider: 'paypal',
                    apiCredentialId: dtoIn.apiCredentialId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive PayPal webhook use case';
            throw new Error(message);
        }
    }
    async resolveCredentialData(apiCredentialId) {
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        if (this.normalizeProvider(apiCredential.provider) !== 'paypal') {
            throw new Error('api credential provider must be paypal');
        }
        const config = this.toRecordOrNull(apiCredential.config);
        const clientId = this.extractString(config, 'clientId') ??
            this.extractString(config, 'client_id');
        if (clientId === null) {
            throw new Error('PayPal clientId is required in api credential config');
        }
        if (apiCredential.token === null || apiCredential.token.trim() === '') {
            throw new Error('PayPal clientSecret/token is required');
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
        const decryptedConfig = this.toRecordOrNull(decryptedTokenDtoOut.apiCredential.config);
        const clientSecret = this.extractString(decryptedConfig, 'token');
        if (clientSecret === null) {
            throw new Error('PayPal decrypted clientSecret/token is required');
        }
        const baseUrl = (this.extractString(config, 'baseUrl') ??
            this.extractString(config, 'base_url') ??
            'https://api-m.sandbox.paypal.com').replace(/\/+$/, '');
        const webhookId = this.extractString(config, 'paypalWebhookId') ??
            this.extractString(config, 'paypal_webhook_id') ??
            this.extractString(config, 'webhookId') ??
            this.extractString(config, 'webhook_id');
        const webhookAuthMode = this.extractString(config, 'webhookAuthMode') ??
            this.extractString(config, 'webhook_auth_mode') ??
            (webhookId === null ? 'optional' : 'required');
        return {
            clientId,
            clientSecret,
            baseUrl,
            webhookId,
            webhookAuthMode,
        };
    }
    async createAccessToken(credentialData) {
        const basicAuth = Buffer.from(`${credentialData.clientId}:${credentialData.clientSecret}`, 'utf8').toString('base64');
        const response = await fetch(`${credentialData.baseUrl}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
        });
        const responseBody = (await response.json().catch(() => ({
            message: 'PayPal returned a non JSON OAuth response',
        })));
        if (!response.ok) {
            throw new Error(this.extractString(responseBody, 'error_description') ??
                this.extractString(responseBody, 'message') ??
                this.extractString(responseBody, 'error') ??
                `PayPal OAuth request failed with status ${response.status}`);
        }
        const accessToken = this.extractString(responseBody, 'access_token');
        if (accessToken === null) {
            throw new Error('PayPal access_token was not returned');
        }
        return accessToken;
    }
    normalizeProvider(provider) {
        const value = String(provider ?? '').trim().toLowerCase();
        if (['paypal', 'pay-pal', 'pay_pal'].includes(value)) {
            return 'paypal';
        }
        return value;
    }
    toRecordOrNull(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    async enrichNormalizedEventWithPaymentTransactionData(event) {
        const paymentTransaction = await this.resolvePaymentTransactionFromEvent(event);
        if (paymentTransaction === null) {
            return event;
        }
        const paymentTransactionRecord = paymentTransaction;
        const metadata = this.toRecordOrNull(paymentTransactionRecord.metadata);
        const config = this.toRecordOrNull(paymentTransactionRecord.config);
        const paymentTransactionId = event.paymentTransactionId ?? this.toNullableString(paymentTransaction._id);
        const checkoutSessionId = event.checkoutSessionId ??
            this.toNullableString(paymentTransaction.checkoutSessionId);
        const subscriptionId = event.subscriptionId ??
            this.extractString(metadata, 'subscriptionId') ??
            this.extractString(metadata, 'subscription_id') ??
            this.extractString(config, 'subscriptionId') ??
            this.extractString(config, 'subscription_id');
        const subscriptionInvoiceId = event.subscriptionInvoiceId ??
            this.extractString(metadata, 'subscriptionInvoiceId') ??
            this.extractString(metadata, 'subscription_invoice_id') ??
            this.extractString(config, 'subscriptionInvoiceId') ??
            this.extractString(config, 'subscription_invoice_id');
        const gatewaySubscriptionId = event.gatewaySubscriptionId ??
            this.extractString(metadata, 'gatewaySubscriptionId') ??
            this.extractString(metadata, 'gateway_subscription_id') ??
            this.extractString(config, 'gatewaySubscriptionId') ??
            this.extractString(config, 'gateway_subscription_id') ??
            this.resolveGatewaySubscriptionIdFromPayPalEvent(event);
        const gatewayInvoiceId = event.gatewayInvoiceId ??
            this.extractString(metadata, 'gatewayInvoiceId') ??
            this.extractString(metadata, 'gateway_invoice_id') ??
            this.extractString(config, 'gatewayInvoiceId') ??
            this.extractString(config, 'gateway_invoice_id');
        if (paymentTransactionId === event.paymentTransactionId &&
            checkoutSessionId === event.checkoutSessionId &&
            subscriptionId === event.subscriptionId &&
            subscriptionInvoiceId === event.subscriptionInvoiceId &&
            gatewaySubscriptionId === event.gatewaySubscriptionId &&
            gatewayInvoiceId === event.gatewayInvoiceId) {
            return event;
        }
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: event.provider,
            eventId: event.eventId,
            eventType: event.eventType,
            eventAction: event.eventAction,
            canonicalStatus: event.canonicalStatus,
            gatewayTransactionId: event.gatewayTransactionId,
            gatewayPaymentIntentId: event.gatewayPaymentIntentId,
            gatewayChargeId: event.gatewayChargeId,
            gatewaySubscriptionId,
            gatewayInvoiceId,
            paymentTransactionId,
            checkoutSessionId,
            subscriptionId,
            subscriptionInvoiceId,
            externalReference: event.externalReference,
            amount: event.amount,
            currency: event.currency,
            rawPayload: event.rawPayload,
            headers: event.headers,
        });
    }
    async resolvePaymentTransactionFromEvent(event) {
        if (event.paymentTransactionId !== null) {
            const found = await this.findPaymentTransactionByUniqueIdSafe(event.paymentTransactionId);
            if (found !== null) {
                return found;
            }
        }
        const gatewayTransactionIds = [
            event.gatewayTransactionId,
            event.gatewayPaymentIntentId,
            event.gatewayChargeId,
            event.gatewaySubscriptionId,
            event.gatewayInvoiceId,
        ].filter((value) => value !== null);
        for (const gatewayTransactionId of gatewayTransactionIds) {
            const found = await this.findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId);
            if (found !== null) {
                return found;
            }
        }
        return null;
    }
    resolveGatewaySubscriptionIdFromPayPalEvent(event) {
        const eventType = String(event.eventType ?? '').trim().toUpperCase();
        if (eventType.includes('BILLING.SUBSCRIPTION')) {
            return event.gatewayTransactionId;
        }
        return null;
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
    async findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId) {
        try {
            const dtoOut = await this.findPaymentTransactionByGatewayTransactionIdService.exec(new find_payment_transaction_by_gateway_transaction_id_dto_in_1.FindPaymentTransactionByGatewayTransactionIdDtoIn(gatewayTransactionId));
            return dtoOut.paymentTransaction;
        }
        catch {
            return null;
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    async autoCaptureApprovedPayPalOrderIfNeeded(params) {
        const event = params.normalizedEvent;
        if (event.provider !== 'paypal') {
            return null;
        }
        if (event.eventType !== 'CHECKOUT.ORDER.APPROVED') {
            return null;
        }
        if (event.canonicalStatus !== 'pending') {
            return null;
        }
        const orderId = event.gatewayTransactionId ??
            event.gatewayPaymentIntentId;
        if (orderId === null || orderId.trim() === '') {
            return null;
        }
        const captureDtoOut = await this.capturePayPalOrderReturnUseCase.exec(new capture_paypal_order_return_dto_in_1.CapturePayPalOrderReturnDtoIn({
            apiCredentialId: params.apiCredentialId,
            orderId,
        }));
        return {
            paymentWebhookEvent: captureDtoOut.paymentWebhookEvent,
            paymentTransaction: captureDtoOut.paymentTransaction,
            processingResult: {
                ...(captureDtoOut.processingResult ?? {}),
                autoCapturedFromWebhook: true,
                sourceEventType: event.eventType,
                sourceEventId: event.eventId,
                orderId,
            },
        };
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
exports.ReceivePayPalWebhookUseCase = ReceivePayPalWebhookUseCase;
exports.ReceivePayPalWebhookUseCase = ReceivePayPalWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_paypal_webhook_service_1.ValidatePayPalWebhookService,
        normalize_paypal_webhook_service_1.NormalizePayPalWebhookService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        process_subscription_webhook_event_use_case_1.ProcessSubscriptionWebhookEventUseCase,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        capture_paypal_order_return_use_case_1.CapturePayPalOrderReturnUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceivePayPalWebhookUseCase);
//# sourceMappingURL=receive-paypal-webhook.use-case.js.map