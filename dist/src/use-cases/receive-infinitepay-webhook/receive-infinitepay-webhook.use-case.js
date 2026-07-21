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
exports.ReceiveInfinitePayWebhookUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const normalize_infinitepay_webhook_dto_in_1 = require("../../modules/payment-webhook-gateways/infinitepay/services/normalize-infinitepay-webhook/dtos/normalize-infinitepay-webhook.dto-in");
const normalize_infinitepay_webhook_service_1 = require("../../modules/payment-webhook-gateways/infinitepay/services/normalize-infinitepay-webhook/normalize-infinitepay-webhook.service");
const normalized_payment_webhook_event_dto_1 = require("../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const register_payment_webhook_event_dto_in_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in");
const register_payment_webhook_event_service_1 = require("../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const process_payment_webhook_event_dto_in_1 = require("../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in");
const process_payment_webhook_event_use_case_1 = require("../process-payment-webhook-event/process-payment-webhook-event.use-case");
const receive_infinitepay_webhook_dto_out_1 = require("./dtos/receive-infinitepay-webhook.dto-out");
let ReceiveInfinitePayWebhookUseCase = class ReceiveInfinitePayWebhookUseCase {
    normalizeInfinitePayWebhookService;
    registerPaymentWebhookEventService;
    processPaymentWebhookEventUseCase;
    findPaymentTransactionByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    handleUseCaseExceptionService;
    constructor(normalizeInfinitePayWebhookService, registerPaymentWebhookEventService, processPaymentWebhookEventUseCase, findPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService, handleUseCaseExceptionService) {
        this.normalizeInfinitePayWebhookService = normalizeInfinitePayWebhookService;
        this.registerPaymentWebhookEventService = registerPaymentWebhookEventService;
        this.processPaymentWebhookEventUseCase = processPaymentWebhookEventUseCase;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const normalizedDtoOut = this.normalizeInfinitePayWebhookService.exec(new normalize_infinitepay_webhook_dto_in_1.NormalizeInfinitePayWebhookDtoIn({
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
                    source: 'ReceiveInfinitePayWebhookUseCase',
                    apiCredentialId: dtoIn.apiCredentialId,
                },
                config: null,
            }));
            const paymentWebhookEvent = registeredDtoOut.paymentWebhookEvent;
            if (registeredDtoOut.wasAlreadyRegistered &&
                String(paymentWebhookEvent.status) === 'processed') {
                return new receive_infinitepay_webhook_dto_out_1.ReceiveInfinitePayWebhookDtoOut(paymentWebhookEvent, null, {
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
            return new receive_infinitepay_webhook_dto_out_1.ReceiveInfinitePayWebhookDtoOut(processedDtoOut.paymentWebhookEvent, processedDtoOut.paymentTransaction, processedDtoOut.processingResult, registeredDtoOut.wasAlreadyRegistered);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ReceiveInfinitePayWebhookUseCase',
                error,
                appFile: __filename,
                context: {
                    provider: 'infinitepay',
                    apiCredentialId: dtoIn.apiCredentialId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on receive InfinitePay webhook use case';
            throw new Error(message);
        }
    }
    async enrichNormalizedEventWithPaymentTransactionData(event) {
        const paymentTransaction = await this.resolvePaymentTransactionFromEvent(event);
        if (paymentTransaction === null) {
            return event;
        }
        const paymentTransactionId = event.paymentTransactionId ??
            this.toNullableString(paymentTransaction._id);
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
        const lookupValues = [
            event.gatewayTransactionId,
            event.gatewayPaymentIntentId,
            event.gatewayChargeId,
            event.gatewayInvoiceId,
            event.externalReference,
        ].filter((value) => value !== null);
        for (const value of lookupValues) {
            const found = await this.findPaymentTransactionByGatewayTransactionIdSafe(value);
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
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.ReceiveInfinitePayWebhookUseCase = ReceiveInfinitePayWebhookUseCase;
exports.ReceiveInfinitePayWebhookUseCase = ReceiveInfinitePayWebhookUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [normalize_infinitepay_webhook_service_1.NormalizeInfinitePayWebhookService,
        register_payment_webhook_event_service_1.RegisterPaymentWebhookEventService,
        process_payment_webhook_event_use_case_1.ProcessPaymentWebhookEventUseCase,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ReceiveInfinitePayWebhookUseCase);
//# sourceMappingURL=receive-infinitepay-webhook.use-case.js.map