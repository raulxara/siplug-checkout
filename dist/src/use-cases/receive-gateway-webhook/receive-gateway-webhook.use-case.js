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
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const receive_gateway_webhook_dto_out_1 = require("./dtos/receive-gateway-webhook.dto-out");
let ReceiveGatewayWebhookUseCase = class ReceiveGatewayWebhookUseCase {
    findApiCredentialByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    findPaymentTransactionByUniqueIdService;
    updatePaymentTransactionService;
    updateCheckoutSessionService;
    handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService, findPaymentTransactionByUniqueIdService, updatePaymentTransactionService, updateCheckoutSessionService, handleUseCaseExceptionService) {
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const normalizedProvider = this.normalize(dtoIn.gatewayProvider);
            if (normalizedProvider === 'stripe') {
                return await this.handleStripeWebhook(dtoIn);
            }
            if (normalizedProvider === 'mercado_pago' ||
                normalizedProvider === 'mercadopago') {
                return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut('mercado_pago.webhook_not_implemented', false, null, null);
            }
            if (normalizedProvider === 'infinitepay' ||
                normalizedProvider === 'infinitypay' ||
                normalizedProvider === 'infinity_pay') {
                return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut('infinitypay.webhook_not_implemented', false, null, null);
            }
            if (normalizedProvider === 'pagseguro') {
                return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut('pagseguro.webhook_not_implemented', false, null, null);
            }
            throw new Error(`gateway webhook provider not supported: ${dtoIn.gatewayProvider}`);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceiveGatewayWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    gatewayProvider: dtoIn.gatewayProvider,
                    hasRawBody: dtoIn.rawBody !== null,
                    eventType: this.toNullableString(dtoIn.payload.type),
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive gateway webhook use case';
            throw new Error(message);
        }
    }
    async handleStripeWebhook(dtoIn) {
        const eventPayload = dtoIn.payload;
        const eventType = this.toNullableString(eventPayload.type) ?? 'unknown';
        const stripeObject = this.extractStripeObject(eventPayload);
        const stripeObjectId = this.toNullableString(stripeObject.id);
        const paymentTransactionIdFromMetadata = this.extractStripePaymentTransactionIdFromMetadata(stripeObject);
        const paymentTransaction = await this.resolvePaymentTransactionForStripeWebhook({
            stripeObjectId,
            paymentTransactionIdFromMetadata,
        });
        if (paymentTransaction === null) {
            throw new Error('payment transaction not found for stripe webhook');
        }
        if (paymentTransaction.apiCredentialId === null) {
            throw new Error('payment transaction api credential id is required');
        }
        const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(paymentTransaction.apiCredentialId));
        const webhookSecret = this.resolveWebhookSecret(apiCredentialDtoOut.apiCredential.config);
        this.verifyStripeSignature({
            rawBody: dtoIn.rawBody,
            signatureHeader: this.getHeader(dtoIn.headers, 'stripe-signature'),
            webhookSecret,
        });
        const mappedStatus = this.mapStripeEventToInternalStatus({
            eventType,
            stripeObject,
        });
        if (mappedStatus === null) {
            return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut(eventType, false, paymentTransaction, null);
        }
        const now = this.nowAsSqlDateTime();
        const updatedPaymentTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,
            gatewayStatus: mappedStatus.gatewayStatus,
            status: mappedStatus.status,
            processStatus: mappedStatus.processStatus,
            processMessage: mappedStatus.processMessage,
            providerResponse: eventPayload,
            gatewayResponse: {
                provider: 'stripe',
                eventType,
                eventId: this.toNullableString(eventPayload.id),
                objectId: stripeObjectId,
                verified: true,
                receivedAt: now,
            },
            paidAt: mappedStatus.status === 'paid' ? now : paymentTransaction.paidAt,
            failedAt: mappedStatus.status === 'failed'
                ? now
                : paymentTransaction.failedAt,
            canceledAt: mappedStatus.status === 'canceled'
                ? now
                : paymentTransaction.canceledAt,
            source: 'ReceiveGatewayWebhookUseCase.stripe',
        }));
        let updatedCheckoutSession = null;
        if (paymentTransaction.checkoutSessionId !== null) {
            const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                _id: paymentTransaction.checkoutSessionId,
                status: this.resolveCheckoutSessionStatus(mappedStatus.status),
                source: 'ReceiveGatewayWebhookUseCase.stripe',
            }));
            updatedCheckoutSession = updatedCheckoutSessionDtoOut.checkoutSession;
        }
        return new receive_gateway_webhook_dto_out_1.ReceiveGatewayWebhookDtoOut(eventType, true, updatedPaymentTransactionDtoOut.paymentTransaction, updatedCheckoutSession);
    }
    async resolvePaymentTransactionForStripeWebhook(params) {
        if (params.stripeObjectId !== null) {
            const byGatewayTransactionId = await this.tryFindPaymentTransactionByGatewayTransactionId(params.stripeObjectId);
            if (byGatewayTransactionId !== null) {
                return byGatewayTransactionId;
            }
        }
        if (params.paymentTransactionIdFromMetadata !== null) {
            const byUniqueId = await this.tryFindPaymentTransactionByUniqueId(params.paymentTransactionIdFromMetadata);
            if (byUniqueId !== null) {
                return byUniqueId;
            }
        }
        return null;
    }
    async tryFindPaymentTransactionByGatewayTransactionId(gatewayTransactionId) {
        try {
            const dtoOut = await this.findPaymentTransactionByGatewayTransactionIdService.exec(new find_payment_transaction_by_gateway_transaction_id_dto_in_1.FindPaymentTransactionByGatewayTransactionIdDtoIn(gatewayTransactionId));
            return dtoOut.paymentTransaction;
        }
        catch {
            return null;
        }
    }
    async tryFindPaymentTransactionByUniqueId(paymentTransactionId) {
        try {
            const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId));
            return dtoOut.paymentTransaction;
        }
        catch {
            return null;
        }
    }
    verifyStripeSignature(params) {
        if (params.rawBody === null) {
            throw new Error('stripe webhook raw body is required');
        }
        if (params.signatureHeader === null) {
            throw new Error('stripe signature header is required');
        }
        const parsedSignature = this.parseStripeSignatureHeader(params.signatureHeader);
        const signedPayload = `${parsedSignature.timestamp}.${params.rawBody.toString('utf8')}`;
        const expectedSignature = (0, crypto_1.createHmac)('sha256', params.webhookSecret)
            .update(signedPayload, 'utf8')
            .digest('hex');
        const signatureMatches = parsedSignature.signatures.some((signature) => this.safeCompareHex(signature, expectedSignature));
        if (!signatureMatches) {
            throw new Error('invalid stripe webhook signature');
        }
    }
    parseStripeSignatureHeader(signatureHeader) {
        const parts = signatureHeader.split(',');
        const timestamp = parts
            .map((part) => part.trim())
            .find((part) => part.startsWith('t='))
            ?.replace('t=', '');
        const signatures = parts
            .map((part) => part.trim())
            .filter((part) => part.startsWith('v1='))
            .map((part) => part.replace('v1=', ''));
        if (!timestamp || signatures.length === 0) {
            throw new Error('invalid stripe signature header format');
        }
        return {
            timestamp,
            signatures,
        };
    }
    safeCompareHex(a, b) {
        const bufferA = Buffer.from(a, 'hex');
        const bufferB = Buffer.from(b, 'hex');
        if (bufferA.length !== bufferB.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(bufferA, bufferB);
    }
    resolveWebhookSecret(config) {
        if (config === null) {
            throw new Error('api credential config is required');
        }
        const webhookSecret = this.toNullableString(config.webhookSecret) ??
            this.toNullableString(config.webhook_secret) ??
            this.toNullableString(config.stripeWebhookSecret) ??
            this.toNullableString(config.stripe_webhook_secret);
        if (webhookSecret === null) {
            throw new Error('stripe webhook secret is required in api credential config');
        }
        return webhookSecret;
    }
    extractStripeObject(eventPayload) {
        const data = this.asObject(eventPayload.data);
        return this.asObject(data.object);
    }
    extractStripePaymentTransactionIdFromMetadata(stripeObject) {
        const metadata = this.asObject(stripeObject.metadata);
        return (this.toNullableString(metadata.paymentTransactionId) ??
            this.toNullableString(metadata.payment_transaction_id));
    }
    mapStripeEventToInternalStatus(params) {
        const paymentStatus = this.toNullableString(params.stripeObject.payment_status) ??
            this.toNullableString(params.stripeObject.status) ??
            params.eventType;
        if (params.eventType === 'checkout.session.completed' ||
            params.eventType === 'checkout.session.async_payment_succeeded' ||
            params.eventType === 'payment_intent.succeeded') {
            return {
                gatewayStatus: paymentStatus,
                status: 'paid',
                processStatus: 'gateway_approved',
                processMessage: `Stripe webhook ${params.eventType} confirmed payment`,
            };
        }
        if (params.eventType === 'checkout.session.async_payment_failed' ||
            params.eventType === 'payment_intent.payment_failed') {
            return {
                gatewayStatus: paymentStatus,
                status: 'failed',
                processStatus: 'gateway_rejected',
                processMessage: `Stripe webhook ${params.eventType} failed payment`,
            };
        }
        if (params.eventType === 'checkout.session.expired') {
            return {
                gatewayStatus: paymentStatus,
                status: 'canceled',
                processStatus: 'gateway_cancelled',
                processMessage: 'Stripe checkout session expired',
            };
        }
        return null;
    }
    resolveCheckoutSessionStatus(paymentTransactionStatus) {
        if (paymentTransactionStatus === 'paid') {
            return 'paid';
        }
        if (paymentTransactionStatus === 'failed') {
            return 'failed';
        }
        if (paymentTransactionStatus === 'canceled') {
            return 'canceled';
        }
        return 'processing';
    }
    getHeader(headers, key) {
        const normalizedKey = key.toLowerCase();
        const headerValue = Object.entries(headers).find(([headerKey]) => headerKey.toLowerCase() === normalizedKey)?.[1];
        if (Array.isArray(headerValue)) {
            return headerValue[0] ?? null;
        }
        return this.toNullableString(headerValue);
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
    normalize(value) {
        return value
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\./g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
    nowAsSqlDateTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
};
exports.ReceiveGatewayWebhookUseCase = ReceiveGatewayWebhookUseCase;
exports.ReceiveGatewayWebhookUseCase = ReceiveGatewayWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceiveGatewayWebhookUseCase);
//# sourceMappingURL=receive-gateway-webhook.use-case.js.map