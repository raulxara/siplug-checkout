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
exports.ProcessPaymentWebhookEventUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const mark_payment_webhook_event_as_failed_dto_in_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-failed/dtos/mark-payment-webhook-event-as-failed.dto-in");
const mark_payment_webhook_event_as_failed_service_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-failed/mark-payment-webhook-event-as-failed.service");
const mark_payment_webhook_event_as_processed_dto_in_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processed/dtos/mark-payment-webhook-event-as-processed.dto-in");
const mark_payment_webhook_event_as_processed_service_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processed/mark-payment-webhook-event-as-processed.service");
const mark_payment_webhook_event_as_processing_dto_in_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processing/dtos/mark-payment-webhook-event-as-processing.dto-in");
const mark_payment_webhook_event_as_processing_service_1 = require("../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processing/mark-payment-webhook-event-as-processing.service");
const find_payment_transaction_by_gateway_transaction_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in");
const find_payment_transaction_by_gateway_transaction_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const get_all_payment_transactions_by_checkout_session_id_dto_in_1 = require("../../modules/payment-transactions/services/get-all-payment-transactions-by-checkout-session-id/dtos/get-all-payment-transactions-by-checkout-session-id.dto-in");
const get_all_payment_transactions_by_checkout_session_id_service_1 = require("../../modules/payment-transactions/services/get-all-payment-transactions-by-checkout-session-id/get-all-payment-transactions-by-checkout-session-id.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const process_payment_webhook_event_dto_out_1 = require("./dtos/process-payment-webhook-event.dto-out");
let ProcessPaymentWebhookEventUseCase = class ProcessPaymentWebhookEventUseCase {
    markPaymentWebhookEventAsProcessingService;
    markPaymentWebhookEventAsProcessedService;
    markPaymentWebhookEventAsFailedService;
    findPaymentTransactionByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    getAllPaymentTransactionsByCheckoutSessionIdService;
    updatePaymentTransactionService;
    handleUseCaseExceptionService;
    constructor(markPaymentWebhookEventAsProcessingService, markPaymentWebhookEventAsProcessedService, markPaymentWebhookEventAsFailedService, findPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService, getAllPaymentTransactionsByCheckoutSessionIdService, updatePaymentTransactionService, handleUseCaseExceptionService) {
        this.markPaymentWebhookEventAsProcessingService = markPaymentWebhookEventAsProcessingService;
        this.markPaymentWebhookEventAsProcessedService = markPaymentWebhookEventAsProcessedService;
        this.markPaymentWebhookEventAsFailedService = markPaymentWebhookEventAsFailedService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.getAllPaymentTransactionsByCheckoutSessionIdService = getAllPaymentTransactionsByCheckoutSessionIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.markPaymentWebhookEventAsProcessingService.exec(new mark_payment_webhook_event_as_processing_dto_in_1.MarkPaymentWebhookEventAsProcessingDtoIn({
                _id: dtoIn.paymentWebhookEventId,
                source: 'ProcessPaymentWebhookEventUseCase.processing',
            }));
            const paymentTransaction = await this.resolvePaymentTransaction(dtoIn.normalizedEvent);
            if (paymentTransaction === null) {
                const processingResult = {
                    ignored: true,
                    reason: 'payment transaction not found for webhook event',
                    provider: dtoIn.normalizedEvent.provider,
                    eventId: dtoIn.normalizedEvent.eventId,
                    eventType: dtoIn.normalizedEvent.eventType,
                    canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
                    paymentTransactionId: dtoIn.normalizedEvent.paymentTransactionId,
                    gatewayTransactionId: dtoIn.normalizedEvent.gatewayTransactionId,
                    gatewayPaymentIntentId: dtoIn.normalizedEvent.gatewayPaymentIntentId,
                    gatewayChargeId: dtoIn.normalizedEvent.gatewayChargeId,
                    checkoutSessionId: dtoIn.normalizedEvent.checkoutSessionId,
                };
                const webhookDtoOut = await this.markPaymentWebhookEventAsProcessedService.exec(new mark_payment_webhook_event_as_processed_dto_in_1.MarkPaymentWebhookEventAsProcessedDtoIn({
                    _id: dtoIn.paymentWebhookEventId,
                    processingResult,
                    source: 'ProcessPaymentWebhookEventUseCase.transactionNotFound',
                }));
                return new process_payment_webhook_event_dto_out_1.ProcessPaymentWebhookEventDtoOut(webhookDtoOut.paymentWebhookEvent, null, false, false, processingResult);
            }
            const statusUpdate = this.resolveTransactionStatusUpdate({
                event: dtoIn.normalizedEvent,
                paymentTransaction,
            });
            if (statusUpdate === null) {
                const processingResult = {
                    ignored: true,
                    reason: 'webhook canonical status does not update payment transaction',
                    provider: dtoIn.normalizedEvent.provider,
                    eventId: dtoIn.normalizedEvent.eventId,
                    eventType: dtoIn.normalizedEvent.eventType,
                    canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
                    paymentTransactionId: paymentTransaction._id,
                };
                const webhookDtoOut = await this.markPaymentWebhookEventAsProcessedService.exec(new mark_payment_webhook_event_as_processed_dto_in_1.MarkPaymentWebhookEventAsProcessedDtoIn({
                    _id: dtoIn.paymentWebhookEventId,
                    processingResult,
                    source: 'ProcessPaymentWebhookEventUseCase.statusIgnored',
                }));
                return new process_payment_webhook_event_dto_out_1.ProcessPaymentWebhookEventDtoOut(webhookDtoOut.paymentWebhookEvent, paymentTransaction, false, false, processingResult);
            }
            const updatedTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                gatewayTransactionId: paymentTransaction.gatewayTransactionId ??
                    this.resolveGatewayTransactionId(dtoIn.normalizedEvent),
                gatewayStatus: statusUpdate.gatewayStatus,
                status: statusUpdate.status,
                processStatus: statusUpdate.processStatus,
                processMessage: statusUpdate.processMessage,
                providerResponse: this.buildProviderResponse({
                    current: paymentTransaction.providerResponse,
                    event: dtoIn.normalizedEvent,
                }),
                gatewayResponse: this.buildGatewayResponse({
                    current: paymentTransaction.gatewayResponse,
                    event: dtoIn.normalizedEvent,
                }),
                paidAt: statusUpdate.paidAt,
                authorizedAt: statusUpdate.authorizedAt,
                canceledAt: statusUpdate.canceledAt,
                failedAt: statusUpdate.failedAt,
                refundedAt: statusUpdate.refundedAt,
                metadata: this.buildMetadata({
                    current: paymentTransaction.metadata,
                    event: dtoIn.normalizedEvent,
                }),
                source: 'ProcessPaymentWebhookEventUseCase.updateTransaction',
            }));
            const splitDispatchDecision = this.resolveSplitDispatchDecision({
                event: dtoIn.normalizedEvent,
                paymentTransaction: updatedTransactionDtoOut.paymentTransaction,
            });
            const splitDispatchRequired = splitDispatchDecision.required;
            const processingResult = {
                ignored: false,
                transactionUpdated: true,
                splitDispatchRequired,
                splitDispatchDecision,
                provider: dtoIn.normalizedEvent.provider,
                eventId: dtoIn.normalizedEvent.eventId,
                eventType: dtoIn.normalizedEvent.eventType,
                eventAction: dtoIn.normalizedEvent.eventAction,
                canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
                paymentTransactionId: updatedTransactionDtoOut.paymentTransaction._id,
                previousStatus: paymentTransaction.status,
                currentStatus: updatedTransactionDtoOut.paymentTransaction.status,
            };
            const webhookDtoOut = await this.markPaymentWebhookEventAsProcessedService.exec(new mark_payment_webhook_event_as_processed_dto_in_1.MarkPaymentWebhookEventAsProcessedDtoIn({
                _id: dtoIn.paymentWebhookEventId,
                processingResult,
                source: 'ProcessPaymentWebhookEventUseCase.processed',
            }));
            return new process_payment_webhook_event_dto_out_1.ProcessPaymentWebhookEventDtoOut(webhookDtoOut.paymentWebhookEvent, updatedTransactionDtoOut.paymentTransaction, true, splitDispatchRequired, processingResult);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on process payment webhook event use case';
            await this.markPaymentWebhookEventAsFailedSafe({
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                errorMessage: message,
                normalizedEvent: dtoIn.normalizedEvent,
            });
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ProcessPaymentWebhookEventUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    provider: dtoIn.normalizedEvent.provider,
                    eventId: dtoIn.normalizedEvent.eventId,
                    canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
                },
            }));
            throw new Error(message);
        }
    }
    async resolvePaymentTransaction(event) {
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
        if (event.checkoutSessionId !== null) {
            const transactions = await this.getPaymentTransactionsByCheckoutSessionIdSafe(event.checkoutSessionId);
            if (transactions.length > 0) {
                return transactions[0];
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
    async getPaymentTransactionsByCheckoutSessionIdSafe(checkoutSessionId) {
        try {
            const dtoOut = await this.getAllPaymentTransactionsByCheckoutSessionIdService.exec(new get_all_payment_transactions_by_checkout_session_id_dto_in_1.GetAllPaymentTransactionsByCheckoutSessionIdDtoIn(checkoutSessionId));
            const response = dtoOut;
            return (response.paymentTransactions ??
                response.transactions ??
                response.items ??
                response.data ??
                []);
        }
        catch {
            return [];
        }
    }
    resolveTransactionStatusUpdate(params) {
        const now = new Date().toISOString();
        const event = params.event;
        const paymentTransaction = params.paymentTransaction;
        switch (event.canonicalStatus) {
            case 'pending':
                return {
                    status: 'pending',
                    processStatus: 'gateway_pending',
                    processMessage: `${event.provider} webhook marked payment as pending`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt,
                    authorizedAt: paymentTransaction.authorizedAt,
                    canceledAt: paymentTransaction.canceledAt,
                    failedAt: paymentTransaction.failedAt,
                    refundedAt: paymentTransaction.refundedAt,
                };
            case 'authorized':
                return {
                    status: 'authorized',
                    processStatus: 'gateway_authorized',
                    processMessage: `${event.provider} webhook marked payment as authorized`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt,
                    authorizedAt: paymentTransaction.authorizedAt ?? now,
                    canceledAt: paymentTransaction.canceledAt,
                    failedAt: paymentTransaction.failedAt,
                    refundedAt: paymentTransaction.refundedAt,
                };
            case 'paid':
            case 'invoice_paid':
                return {
                    status: 'paid',
                    processStatus: 'paid',
                    processMessage: `${event.provider} webhook marked payment as paid`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt ?? now,
                    authorizedAt: paymentTransaction.authorizedAt,
                    canceledAt: paymentTransaction.canceledAt,
                    failedAt: paymentTransaction.failedAt,
                    refundedAt: paymentTransaction.refundedAt,
                };
            case 'failed':
            case 'invoice_payment_failed':
                return {
                    status: 'failed',
                    processStatus: 'gateway_failed',
                    processMessage: `${event.provider} webhook marked payment as failed`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt,
                    authorizedAt: paymentTransaction.authorizedAt,
                    canceledAt: paymentTransaction.canceledAt,
                    failedAt: paymentTransaction.failedAt ?? now,
                    refundedAt: paymentTransaction.refundedAt,
                };
            case 'canceled':
            case 'expired':
                return {
                    status: event.canonicalStatus,
                    processStatus: `gateway_${event.canonicalStatus}`,
                    processMessage: `${event.provider} webhook marked payment as ${event.canonicalStatus}`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt,
                    authorizedAt: paymentTransaction.authorizedAt,
                    canceledAt: paymentTransaction.canceledAt ?? now,
                    failedAt: paymentTransaction.failedAt,
                    refundedAt: paymentTransaction.refundedAt,
                };
            case 'refunded':
            case 'chargeback':
                return {
                    status: event.canonicalStatus,
                    processStatus: `gateway_${event.canonicalStatus}`,
                    processMessage: `${event.provider} webhook marked payment as ${event.canonicalStatus}`,
                    gatewayStatus: event.canonicalStatus,
                    paidAt: paymentTransaction.paidAt,
                    authorizedAt: paymentTransaction.authorizedAt,
                    canceledAt: paymentTransaction.canceledAt,
                    failedAt: paymentTransaction.failedAt,
                    refundedAt: paymentTransaction.refundedAt ?? now,
                };
            case 'subscription_active':
            case 'subscription_canceled':
            case 'ignored':
                return null;
            default:
                return null;
        }
    }
    resolveGatewayTransactionId(event) {
        return (event.gatewayTransactionId ??
            event.gatewayPaymentIntentId ??
            event.gatewayChargeId);
    }
    buildProviderResponse(params) {
        return {
            ...(params.current ?? {}),
            latestWebhookPayload: params.event.rawPayload,
        };
    }
    buildGatewayResponse(params) {
        return {
            ...(params.current ?? {}),
            latestWebhook: {
                provider: params.event.provider,
                eventId: params.event.eventId,
                eventType: params.event.eventType,
                eventAction: params.event.eventAction,
                canonicalStatus: params.event.canonicalStatus,
                gatewayTransactionId: params.event.gatewayTransactionId,
                gatewayPaymentIntentId: params.event.gatewayPaymentIntentId,
                gatewayChargeId: params.event.gatewayChargeId,
                gatewaySubscriptionId: params.event.gatewaySubscriptionId,
                gatewayInvoiceId: params.event.gatewayInvoiceId,
                amount: params.event.amount,
                currency: params.event.currency,
                receivedAt: new Date().toISOString(),
            },
        };
    }
    buildMetadata(params) {
        return {
            ...(params.current ?? {}),
            lastWebhook: {
                provider: params.event.provider,
                eventId: params.event.eventId,
                eventType: params.event.eventType,
                eventAction: params.event.eventAction,
                canonicalStatus: params.event.canonicalStatus,
                processedAt: new Date().toISOString(),
            },
        };
    }
    resolveSplitDispatchDecision(params) {
        const paidStatuses = ['paid', 'invoice_paid'];
        if (!paidStatuses.includes(params.event.canonicalStatus)) {
            return {
                required: false,
                reason: 'webhook status is not paid',
                sourceTransactionId: null,
                paymentSplitId: null,
                authoritativeEvent: false,
            };
        }
        if (params.paymentTransaction.hasSplit !== true) {
            return {
                required: false,
                reason: 'payment transaction does not have split',
                sourceTransactionId: null,
                paymentSplitId: null,
                authoritativeEvent: false,
            };
        }
        const paymentSplitId = this.extractPaymentSplitIdFromTransactionConfig(params.paymentTransaction.config);
        if (paymentSplitId === null) {
            return {
                required: false,
                reason: 'payment split id not found in payment transaction config',
                sourceTransactionId: null,
                paymentSplitId: null,
                authoritativeEvent: false,
            };
        }
        if (params.event.provider === 'stripe') {
            return this.resolveStripeSplitDispatchDecision({
                event: params.event,
                paymentSplitId,
            });
        }
        return {
            required: true,
            reason: 'paid webhook event requires split dispatch',
            sourceTransactionId: this.resolveGenericSourceTransactionId(params.event),
            paymentSplitId,
            authoritativeEvent: true,
        };
    }
    resolveStripeSplitDispatchDecision(params) {
        if (params.event.eventType !== 'charge.succeeded') {
            return {
                required: false,
                reason: 'stripe split dispatch is allowed only from charge.succeeded to avoid duplicate dispatch',
                sourceTransactionId: null,
                paymentSplitId: params.paymentSplitId,
                authoritativeEvent: false,
            };
        }
        const sourceTransactionId = params.event.gatewayChargeId ?? params.event.gatewayTransactionId;
        if (sourceTransactionId === null || !sourceTransactionId.startsWith('ch_')) {
            return {
                required: false,
                reason: 'stripe charge id is required for split dispatch',
                sourceTransactionId,
                paymentSplitId: params.paymentSplitId,
                authoritativeEvent: true,
            };
        }
        return {
            required: true,
            reason: 'stripe charge.succeeded is authoritative for split dispatch',
            sourceTransactionId,
            paymentSplitId: params.paymentSplitId,
            authoritativeEvent: true,
        };
    }
    resolveGenericSourceTransactionId(event) {
        return (event.gatewayChargeId ??
            event.gatewayTransactionId ??
            event.gatewayPaymentIntentId ??
            event.gatewayInvoiceId);
    }
    extractPaymentSplitIdFromTransactionConfig(config) {
        if (config === null) {
            return null;
        }
        const split = config.split;
        if (!split || typeof split !== 'object' || Array.isArray(split)) {
            return null;
        }
        const paymentSplitId = split.paymentSplitId;
        if (paymentSplitId === undefined || paymentSplitId === null) {
            return null;
        }
        const stringValue = String(paymentSplitId).trim();
        return stringValue === '' ? null : stringValue;
    }
    async markPaymentWebhookEventAsFailedSafe(params) {
        try {
            await this.markPaymentWebhookEventAsFailedService.exec(new mark_payment_webhook_event_as_failed_dto_in_1.MarkPaymentWebhookEventAsFailedDtoIn({
                _id: params.paymentWebhookEventId,
                errorMessage: params.errorMessage,
                processingResult: {
                    provider: params.normalizedEvent.provider,
                    eventId: params.normalizedEvent.eventId,
                    canonicalStatus: params.normalizedEvent.canonicalStatus,
                    errorMessage: params.errorMessage,
                },
                source: 'ProcessPaymentWebhookEventUseCase.failed',
            }));
        }
        catch {
        }
    }
};
exports.ProcessPaymentWebhookEventUseCase = ProcessPaymentWebhookEventUseCase;
exports.ProcessPaymentWebhookEventUseCase = ProcessPaymentWebhookEventUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mark_payment_webhook_event_as_processing_service_1.MarkPaymentWebhookEventAsProcessingService,
        mark_payment_webhook_event_as_processed_service_1.MarkPaymentWebhookEventAsProcessedService,
        mark_payment_webhook_event_as_failed_service_1.MarkPaymentWebhookEventAsFailedService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        find_payment_transaction_by_gateway_transaction_id_service_1.FindPaymentTransactionByGatewayTransactionIdService,
        get_all_payment_transactions_by_checkout_session_id_service_1.GetAllPaymentTransactionsByCheckoutSessionIdService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessPaymentWebhookEventUseCase);
//# sourceMappingURL=process-payment-webhook-event.use-case.js.map