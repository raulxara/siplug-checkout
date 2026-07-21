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
exports.CapturePayPalOrderReturnUseCase = void 0;
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
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const capture_paypal_order_return_dto_out_1 = require("./dtos/capture-paypal-order-return.dto-out");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
let CapturePayPalOrderReturnUseCase = class CapturePayPalOrderReturnUseCase {
    findApiCredentialByUniqueIdService;
    decryptApiCredentialSecretService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    handleUseCaseExceptionService;
    findPaymentTransactionByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    constructor(findApiCredentialByUniqueIdService, decryptApiCredentialSecretService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, handleUseCaseExceptionService, findPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.decryptApiCredentialSecretService = decryptApiCredentialSecretService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
    }
    async exec(dtoIn) {
        try {
            const credentialData = await this.resolveCredentialData(dtoIn.apiCredentialId);
            const accessToken = await this.createAccessToken(credentialData);
            const captureResponse = await fetch(`${credentialData.baseUrl}/v2/checkout/orders/${dtoIn.orderId}/capture`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation',
                },
            });
            const captureBody = await this.parseJsonResponse(captureResponse);
            if (!captureResponse.ok) {
                throw new Error(this.extractPayPalErrorMessage(captureBody) ??
                    `PayPal capture order request failed with status ${captureResponse.status}`);
            }
            const normalizedEvent = this.buildNormalizedCaptureEvent({
                apiCredentialId: dtoIn.apiCredentialId,
                orderId: dtoIn.orderId,
                captureBody,
            });
            return await this.registerAndProcessNormalizedEvent({
                normalizedEvent,
                metadata: {
                    source: 'CapturePayPalOrderReturnUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                    orderId: dtoIn.orderId,
                },
                providerResponse: captureBody,
            });
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'CapturePayPalOrderReturnUseCase',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    orderId: dtoIn.orderId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on capture paypal order return use case';
            throw new Error(message);
        }
    }
    async execCancel(dtoIn) {
        try {
            const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
                provider: 'paypal',
                eventId: `paypal-return-cancel:${dtoIn.orderId}`,
                eventType: 'CHECKOUT.ORDER.CANCELLED.RETURN',
                eventAction: 'checkout.order.canceled',
                canonicalStatus: 'canceled',
                gatewayTransactionId: dtoIn.orderId,
                gatewayPaymentIntentId: dtoIn.orderId,
                gatewayChargeId: null,
                gatewaySubscriptionId: null,
                gatewayInvoiceId: null,
                paymentTransactionId: null,
                checkoutSessionId: null,
                subscriptionId: null,
                subscriptionInvoiceId: null,
                externalReference: dtoIn.orderId,
                amount: null,
                currency: null,
                rawPayload: {
                    source: 'paypal-return-cancel',
                    orderId: dtoIn.orderId,
                },
                headers: {
                    source: 'paypal-return-cancel',
                },
            });
            return await this.registerAndProcessNormalizedEvent({
                normalizedEvent,
                metadata: {
                    source: 'CapturePayPalOrderReturnUseCase.cancel',
                    apiCredentialId: dtoIn.apiCredentialId,
                    orderId: dtoIn.orderId,
                },
                providerResponse: null,
            });
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'CapturePayPalOrderReturnUseCase.execCancel',
                error,
                appFile: __filename,
                context: {
                    apiCredentialId: dtoIn.apiCredentialId,
                    orderId: dtoIn.orderId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on cancel paypal order return use case';
            throw new Error(message);
        }
    }
    async registerAndProcessNormalizedEvent(params) {
        const normalizedEvent = await this.enrichNormalizedEventWithPaymentTransactionData(params.normalizedEvent);
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
            normalizedPayload: this.buildNormalizedPayload(normalizedEvent),
            metadata: params.metadata,
            config: null,
        }));
        const paymentWebhookEvent = registeredDtoOut.paymentWebhookEvent;
        if (registeredDtoOut.wasAlreadyRegistered &&
            String(paymentWebhookEvent.status) === 'processed') {
            return new capture_paypal_order_return_dto_out_1.CapturePayPalOrderReturnDtoOut(paymentWebhookEvent, null, {
                ignored: true,
                reason: 'paypal return event already processed',
                provider: normalizedEvent.provider,
                eventId: normalizedEvent.eventId,
            }, params.providerResponse, true);
        }
        const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();
        if (paymentWebhookEventId === '') {
            throw new Error('paymentWebhookEvent._id is required');
        }
        const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(new process_payment_webhook_event_dto_in_1.ProcessPaymentWebhookEventDtoIn({
            paymentWebhookEventId,
            normalizedEvent,
        }));
        return new capture_paypal_order_return_dto_out_1.CapturePayPalOrderReturnDtoOut(processedDtoOut.paymentWebhookEvent, processedDtoOut.paymentTransaction, processedDtoOut.processingResult, params.providerResponse, registeredDtoOut.wasAlreadyRegistered);
    }
    buildNormalizedCaptureEvent(params) {
        const capture = this.extractFirstCapture(params.captureBody);
        const captureId = this.extractString(capture, 'id') ??
            this.extractString(params.captureBody, 'id');
        const status = this.extractString(capture, 'status') ??
            this.extractString(params.captureBody, 'status') ??
            'COMPLETED';
        const amountObject = this.toRecordOrNull(capture?.amount);
        const amount = this.amountToCents(this.extractString(amountObject, 'value'));
        const currency = this.extractString(amountObject, 'currency_code') ?? 'BRL';
        const canonicalStatus = this.mapPayPalStatusToCanonicalStatus(status);
        return new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'paypal',
            eventId: `paypal-return-capture:${params.orderId}:${captureId ?? 'unknown'}:${status}`,
            eventType: 'PAYMENT.CAPTURE.RETURN',
            eventAction: `payment.capture.${status.toLowerCase()}`,
            canonicalStatus,
            gatewayTransactionId: params.orderId,
            gatewayPaymentIntentId: params.orderId,
            gatewayChargeId: captureId,
            gatewaySubscriptionId: null,
            gatewayInvoiceId: null,
            paymentTransactionId: this.extractPaymentTransactionIdFromCaptureBody(params.captureBody),
            checkoutSessionId: null,
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: this.extractExternalReferenceFromCaptureBody(params.captureBody) ??
                params.orderId,
            amount,
            currency,
            rawPayload: {
                paypal: params.captureBody,
            },
            headers: {
                source: 'paypal-return-capture',
            },
        });
    }
    extractFirstCapture(body) {
        const purchaseUnits = body.purchase_units;
        if (!Array.isArray(purchaseUnits)) {
            return null;
        }
        for (const purchaseUnit of purchaseUnits) {
            const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);
            const payments = this.toRecordOrNull(purchaseUnitObject?.payments);
            const captures = payments?.captures;
            if (Array.isArray(captures) && captures.length > 0) {
                return this.toRecordOrNull(captures[0]);
            }
        }
        return null;
    }
    extractPaymentTransactionIdFromCaptureBody(body) {
        const purchaseUnits = body.purchase_units;
        if (!Array.isArray(purchaseUnits)) {
            return null;
        }
        for (const purchaseUnit of purchaseUnits) {
            const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);
            const customId = this.extractString(purchaseUnitObject, 'custom_id');
            if (customId !== null) {
                return customId;
            }
        }
        return null;
    }
    extractExternalReferenceFromCaptureBody(body) {
        const purchaseUnits = body.purchase_units;
        if (!Array.isArray(purchaseUnits)) {
            return null;
        }
        for (const purchaseUnit of purchaseUnits) {
            const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);
            const invoiceId = this.extractString(purchaseUnitObject, 'invoice_id');
            const referenceId = this.extractString(purchaseUnitObject, 'reference_id');
            if (invoiceId !== null) {
                return invoiceId;
            }
            if (referenceId !== null) {
                return referenceId;
            }
        }
        return null;
    }
    mapPayPalStatusToCanonicalStatus(status) {
        const normalized = status.toUpperCase().trim();
        if (normalized === 'COMPLETED' || normalized === 'APPROVED') {
            return 'paid';
        }
        if (normalized === 'PENDING') {
            return 'pending';
        }
        if (normalized === 'DENIED' || normalized === 'FAILED') {
            return 'failed';
        }
        if (normalized === 'VOIDED' ||
            normalized === 'CANCELLED' ||
            normalized === 'CANCELED') {
            return 'canceled';
        }
        if (normalized === 'REFUNDED' ||
            normalized === 'PARTIALLY_REFUNDED') {
            return 'refunded';
        }
        return 'ignored';
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
        return {
            clientId,
            clientSecret,
            baseUrl,
        };
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    async enrichNormalizedEventWithPaymentTransactionData(event) {
        const paymentTransaction = await this.resolvePaymentTransactionFromEvent(event);
        if (paymentTransaction === null) {
            return event;
        }
        const paymentTransactionId = event.paymentTransactionId ?? this.toNullableString(paymentTransaction._id);
        const checkoutSessionId = event.checkoutSessionId ??
            this.toNullableString(paymentTransaction.checkoutSessionId);
        if (paymentTransactionId === event.paymentTransactionId &&
            checkoutSessionId === event.checkoutSessionId) {
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
            gatewaySubscriptionId: event.gatewaySubscriptionId,
            gatewayInvoiceId: event.gatewayInvoiceId,
            paymentTransactionId,
            checkoutSessionId,
            subscriptionId: event.subscriptionId,
            subscriptionInvoiceId: event.subscriptionInvoiceId,
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
        ].filter((value) => value !== null);
        for (const gatewayTransactionId of gatewayTransactionIds) {
            const found = await this.findPaymentTransactionByGatewayTransactionIdSafe(gatewayTransactionId);
            if (found !== null) {
                return found;
            }
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
    async parseJsonResponse(response) {
        const rawText = await response.text();
        if (rawText.trim() === '') {
            return {
                message: 'PayPal returned an empty response',
                statusCode: response.status,
            };
        }
        try {
            const parsed = JSON.parse(rawText);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
            return {
                message: 'PayPal returned a non object JSON response',
                rawResponse: rawText,
                statusCode: response.status,
            };
        }
        catch {
            return {
                message: 'PayPal returned a non JSON response',
                rawResponse: rawText.slice(0, 2000),
                statusCode: response.status,
            };
        }
    }
    extractPayPalErrorMessage(body) {
        if (body.details !== undefined) {
            return JSON.stringify(body.details);
        }
        return (this.extractString(body, 'message') ??
            this.extractString(body, 'name') ??
            this.extractString(body, 'error_description') ??
            this.extractString(body, 'error'));
    }
    buildNormalizedPayload(event) {
        return {
            provider: event.provider,
            eventId: event.eventId,
            eventType: event.eventType,
            eventAction: event.eventAction,
            canonicalStatus: event.canonicalStatus,
            gatewayTransactionId: event.gatewayTransactionId,
            gatewayPaymentIntentId: event.gatewayPaymentIntentId,
            gatewayChargeId: event.gatewayChargeId,
            gatewaySubscriptionId: event.gatewaySubscriptionId,
            gatewayInvoiceId: event.gatewayInvoiceId,
            paymentTransactionId: event.paymentTransactionId,
            checkoutSessionId: event.checkoutSessionId,
            subscriptionId: event.subscriptionId,
            subscriptionInvoiceId: event.subscriptionInvoiceId,
            externalReference: event.externalReference,
            amount: event.amount,
            currency: event.currency,
        };
    }
    amountToCents(value) {
        if (value === null) {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            return null;
        }
        return Math.round(numberValue * 100);
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
exports.CapturePayPalOrderReturnUseCase = CapturePayPalOrderReturnUseCase;
exports.CapturePayPalOrderReturnUseCase = CapturePayPalOrderReturnUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        decrypt_api_credential_secret_service_1.DecryptApiCredentialSecretService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService])
], CapturePayPalOrderReturnUseCase);
//# sourceMappingURL=capture-paypal-order-return.use-case.js.map