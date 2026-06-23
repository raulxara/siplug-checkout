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
exports.ReceiveStripeWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const decrypt_api_credential_secret_dto_in_1 = require("../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in");
const decrypt_api_credential_secret_service_1 = require("../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const normalize_stripe_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/stripe/services/normalize-stripe-webhook/dtos/normalize-stripe-webhook.dto-in");
const normalize_stripe_webhook_service_1 = require("../../modules/payment-webhook-gateways/stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service");
const validate_stripe_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/stripe/services/validate-stripe-webhook/dtos/validate-stripe-webhook.dto-in");
const validate_stripe_webhook_service_1 = require("../../modules/payment-webhook-gateways/stripe/services/validate-stripe-webhook/validate-stripe-webhook.service");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_stripe_webhook_dto_out_1 = require("./dtos/receive-stripe-webhook.dto-out");
const process_subscription_webhook_event_dto_in_1 = require("../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in");
const process_subscription_webhook_event_use_case_1 = require("../process-subscription-webhook-event/process-subscription-webhook-event.use-case");
let ReceiveStripeWebhookUseCase = class ReceiveStripeWebhookUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    validateStripeWebhookService;
    normalizeStripeWebhookService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    processSubscriptionWebhookEventUseCase;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, validateStripeWebhookService, normalizeStripeWebhookService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, processSubscriptionWebhookEventUseCase, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.validateStripeWebhookService = validateStripeWebhookService;
        this.normalizeStripeWebhookService = normalizeStripeWebhookService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.processSubscriptionWebhookEventUseCase = processSubscriptionWebhookEventUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const endpointSecret = await this.resolveEndpointSecretFromApiCredential(dtoIn.apiCredentialId);
            await this.validateStripeWebhookService.exec(new validate_stripe_webhook_dto_in_1.ValidateStripeWebhookDtoIn({
                rawBody: dtoIn.rawBody,
                stripeSignature: dtoIn.stripeSignature,
                endpointSecret,
                toleranceInSeconds: 300,
            }));
            const normalizedDtoOut = this.normalizeStripeWebhookService.exec(new normalize_stripe_webhook_dto_in_1.NormalizeStripeWebhookDtoIn({
                payload: dtoIn.payload,
                headers: dtoIn.headers,
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
                    source: 'ReceiveStripeWebhookUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                },
                config: null,
            }));
            const paymentWebhookEvent = registeredDtoOut.paymentWebhookEvent;
            if (registeredDtoOut.wasAlreadyRegistered &&
                String(paymentWebhookEvent.status) === 'processed') {
                return new receive_stripe_webhook_dto_out_1.ReceiveStripeWebhookDtoOut(paymentWebhookEvent, null, {
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
            return new receive_stripe_webhook_dto_out_1.ReceiveStripeWebhookDtoOut(subscriptionProcessedDtoOut.paymentWebhookEvent, subscriptionProcessedDtoOut.paymentTransaction, {
                paymentProcessingResult: processedDtoOut.processingResult,
                subscriptionProcessingResult: subscriptionProcessedDtoOut.processingResult,
            }, registeredDtoOut.wasAlreadyRegistered);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceiveStripeWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    provider: 'stripe',
                    apiCredentialId: dtoIn.apiCredentialId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive Stripe webhook use case';
            throw new Error(message);
        }
    }
    async resolveEndpointSecretFromApiCredential(apiCredentialId) {
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(apiCredentialId));
        const apiCredential = apiCredentialDtoOut.apiCredential;
        if (apiCredential.status !== 'active') {
            throw new Error('api credential is not active');
        }
        if (apiCredential.provider !== 'stripe') {
            throw new Error('api credential provider must be stripe');
        }
        const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(new decrypt_api_credential_secret_dto_in_1.DecryptApiCredentialSecretDtoIn({
            apiCredential: {
                config: apiCredential.config ?? {},
            },
            keysToDecrypt: ['webhookSecret', 'webhook_secret'],
            strict: false,
        }));
        const config = decryptedDtoOut.apiCredential.config;
        const webhookSecret = this.extractStringFromConfig(config, 'webhookSecret') ??
            this.extractStringFromConfig(config, 'webhook_secret');
        if (webhookSecret === null) {
            throw new Error('api credential config.webhookSecret is required');
        }
        if (!webhookSecret.startsWith('whsec_')) {
            throw new Error('api credential config.webhookSecret must start with whsec_');
        }
        return webhookSecret;
    }
    extractStringFromConfig(config, key) {
        if (!config || typeof config !== 'object' || Array.isArray(config)) {
            return null;
        }
        const value = config[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.ReceiveStripeWebhookUseCase = ReceiveStripeWebhookUseCase;
exports.ReceiveStripeWebhookUseCase = ReceiveStripeWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        validate_stripe_webhook_service_1.ValidateStripeWebhookService,
        normalize_stripe_webhook_service_1.NormalizeStripeWebhookService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        process_subscription_webhook_event_use_case_1.ProcessSubscriptionWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceiveStripeWebhookUseCase);
//# sourceMappingURL=receive-stripe-webhook.use-case.js.map