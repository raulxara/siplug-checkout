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
const resolve_payment_split_dispatch_eligibility_dto_in_1 = require("../../modules/payment-splits/services/resolve-payment-split-dispatch-eligibility/dtos/resolve-payment-split-dispatch-eligibility.dto-in");
const resolve_payment_split_dispatch_eligibility_service_1 = require("../../modules/payment-splits/services/resolve-payment-split-dispatch-eligibility/resolve-payment-split-dispatch-eligibility.service");
const reserve_payment_split_dispatch_dto_in_1 = require("../../modules/payment-splits/services/reserve-payment-split-dispatch/dtos/reserve-payment-split-dispatch.dto-in");
const reserve_payment_split_dispatch_service_1 = require("../../modules/payment-splits/services/reserve-payment-split-dispatch/reserve-payment-split-dispatch.service");
const dispatch_payment_split_to_gateway_dto_in_1 = require("../dispatch-payment-split-to-gateway/dtos/dispatch-payment-split-to-gateway.dto-in");
const dispatch_payment_split_to_gateway_use_case_1 = require("../dispatch-payment-split-to-gateway/dispatch-payment-split-to-gateway.use-case");
const mark_native_payment_split_as_transferred_dto_in_1 = require("../../modules/payment-splits/services/mark-native-payment-split-as-transferred/dtos/mark-native-payment-split-as-transferred.dto-in");
const mark_native_payment_split_as_transferred_service_1 = require("../../modules/payment-splits/services/mark-native-payment-split-as-transferred/mark-native-payment-split-as-transferred.service");
let ProcessPaymentWebhookEventUseCase = class ProcessPaymentWebhookEventUseCase {
    markPaymentWebhookEventAsProcessingService;
    markPaymentWebhookEventAsProcessedService;
    markPaymentWebhookEventAsFailedService;
    findPaymentTransactionByUniqueIdService;
    findPaymentTransactionByGatewayTransactionIdService;
    getAllPaymentTransactionsByCheckoutSessionIdService;
    updatePaymentTransactionService;
    resolvePaymentSplitDispatchEligibilityService;
    reservePaymentSplitDispatchService;
    dispatchPaymentSplitToGatewayUseCase;
    markNativePaymentSplitAsTransferredService;
    handleUseCaseExceptionService;
    constructor(markPaymentWebhookEventAsProcessingService, markPaymentWebhookEventAsProcessedService, markPaymentWebhookEventAsFailedService, findPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService, getAllPaymentTransactionsByCheckoutSessionIdService, updatePaymentTransactionService, resolvePaymentSplitDispatchEligibilityService, reservePaymentSplitDispatchService, dispatchPaymentSplitToGatewayUseCase, markNativePaymentSplitAsTransferredService, handleUseCaseExceptionService) {
        this.markPaymentWebhookEventAsProcessingService = markPaymentWebhookEventAsProcessingService;
        this.markPaymentWebhookEventAsProcessedService = markPaymentWebhookEventAsProcessedService;
        this.markPaymentWebhookEventAsFailedService = markPaymentWebhookEventAsFailedService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.findPaymentTransactionByGatewayTransactionIdService = findPaymentTransactionByGatewayTransactionIdService;
        this.getAllPaymentTransactionsByCheckoutSessionIdService = getAllPaymentTransactionsByCheckoutSessionIdService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.resolvePaymentSplitDispatchEligibilityService = resolvePaymentSplitDispatchEligibilityService;
        this.reservePaymentSplitDispatchService = reservePaymentSplitDispatchService;
        this.dispatchPaymentSplitToGatewayUseCase = dispatchPaymentSplitToGatewayUseCase;
        this.markNativePaymentSplitAsTransferredService = markNativePaymentSplitAsTransferredService;
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
            const initialSplitDispatchDecision = this.resolveSplitDispatchDecision({
                event: dtoIn.normalizedEvent,
                paymentTransaction: updatedTransactionDtoOut.paymentTransaction,
            });
            const splitDispatchEligibility = await this.resolveSplitDispatchEligibilitySafe({
                initialDecision: initialSplitDispatchDecision,
            });
            const splitDispatchRequired = initialSplitDispatchDecision.required &&
                splitDispatchEligibility.eligible;
            const splitDispatchDecision = {
                ...initialSplitDispatchDecision,
                required: splitDispatchRequired,
                originalRequired: initialSplitDispatchDecision.required,
                eligibility: splitDispatchEligibility,
                reason: splitDispatchRequired
                    ? initialSplitDispatchDecision.reason
                    : splitDispatchEligibility.reason,
            };
            const splitDispatchReservation = await this.reservePaymentSplitDispatchIfRequired({
                splitDispatchRequired,
                splitDispatchDecision,
                event: dtoIn.normalizedEvent,
                paymentTransaction: updatedTransactionDtoOut.paymentTransaction,
            });
            const finalSplitDispatchRequired = splitDispatchRequired && splitDispatchReservation.reserved;
            const finalSplitDispatchDecision = {
                ...splitDispatchDecision,
                required: finalSplitDispatchRequired,
                reservation: splitDispatchReservation,
                reason: finalSplitDispatchRequired
                    ? splitDispatchDecision.reason
                    : splitDispatchReservation.reason,
            };
            const splitGatewayDispatchResult = await this.dispatchPaymentSplitToGatewayFromWebhookSafe({
                splitDispatchRequired: finalSplitDispatchRequired,
                splitDispatchDecision: finalSplitDispatchDecision,
                paymentTransactionId: String(updatedTransactionDtoOut.paymentTransaction._id),
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                provider: dtoIn.normalizedEvent.provider,
                eventId: dtoIn.normalizedEvent.eventId,
                eventType: dtoIn.normalizedEvent.eventType,
                eventAction: dtoIn.normalizedEvent.eventAction,
                canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
                gatewayTransactionId: dtoIn.normalizedEvent.gatewayTransactionId,
                rawPayload: dtoIn.normalizedEvent.rawPayload,
            });
            const splitProcessingSummary = this.buildSplitProcessingSummary({
                provider: dtoIn.normalizedEvent.provider,
                splitDispatchRequired: finalSplitDispatchRequired,
                splitDispatchDecision: finalSplitDispatchDecision,
                splitGatewayDispatchResult,
            });
            const processingResult = {
                ignored: false,
                transactionUpdated: true,
                split: splitProcessingSummary,
                splitDispatchRequired: finalSplitDispatchRequired,
                splitDispatchDecision: finalSplitDispatchDecision,
                splitGatewayDispatchResult,
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
            return new process_payment_webhook_event_dto_out_1.ProcessPaymentWebhookEventDtoOut(webhookDtoOut.paymentWebhookEvent, updatedTransactionDtoOut.paymentTransaction, true, finalSplitDispatchRequired, processingResult);
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
            event.gatewayInvoiceId,
            event.gatewaySubscriptionId,
            event.externalReference,
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
    toObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
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
    buildSplitProcessingSummary(params) {
        const paymentSplit = this.toObject(params.splitGatewayDispatchResult.paymentSplit);
        return {
            provider: params.provider,
            mode: this.usesNativeSplitSettlement(params.provider)
                ? 'native_split'
                : 'external_gateway_dispatch',
            required: params.splitDispatchRequired,
            dispatched: params.splitGatewayDispatchResult.dispatched === true,
            nativeSettled: params.splitGatewayDispatchResult.nativeSettled === true,
            wasAlreadySettled: params.splitGatewayDispatchResult.wasAlreadySettled === true,
            paymentSplitId: params.splitDispatchDecision.paymentSplitId,
            sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
            paymentSplitStatus: this.toNullableString(paymentSplit?.status) ?? null,
            reason: this.toNullableString(params.splitGatewayDispatchResult.reason) ??
                params.splitDispatchDecision.reason,
            gatewayResult: this.toObject(params.splitGatewayDispatchResult.gatewayResult) ?? null,
        };
    }
    async dispatchPaymentSplitToGatewayFromWebhookSafe(params) {
        if (this.usesNativeSplitSettlement(params.provider) &&
            this.isPaidWebhookStatus(params.canonicalStatus)) {
            return await this.settleNativeSplitFromWebhookSafe({
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                paymentTransactionId: params.paymentTransactionId,
                paymentWebhookEventId: params.paymentWebhookEventId,
                provider: params.provider,
                eventId: params.eventId,
                eventType: params.eventType,
                eventAction: params.eventAction,
                canonicalStatus: params.canonicalStatus,
                sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
                rawPayload: params.rawPayload ?? null,
            });
        }
        if (!params.splitDispatchRequired) {
            return {
                dispatched: false,
                reason: params.splitDispatchDecision.reason,
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
            };
        }
        if (params.splitDispatchDecision.paymentSplitId === null) {
            return {
                dispatched: false,
                reason: 'paymentSplitId is required for split gateway dispatch',
                paymentSplitId: null,
                sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
            };
        }
        if (params.splitDispatchDecision.sourceTransactionId === null) {
            return {
                dispatched: false,
                reason: 'sourceTransactionId is required for split gateway dispatch',
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                sourceTransactionId: null,
            };
        }
        try {
            const dtoOut = await this.dispatchPaymentSplitToGatewayUseCase.exec(new dispatch_payment_split_to_gateway_dto_in_1.DispatchPaymentSplitToGatewayDtoIn({
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
                paymentTransactionId: params.paymentTransactionId,
                paymentWebhookEventId: params.paymentWebhookEventId,
                provider: params.provider,
                eventId: params.eventId,
                eventType: params.eventType,
                eventAction: params.eventAction,
                canonicalStatus: params.canonicalStatus,
            }));
            return {
                dispatched: dtoOut.dispatched,
                reason: dtoOut.reason,
                paymentSplit: dtoOut.paymentSplit,
                paymentSplitRecipients: dtoOut.paymentSplitRecipients,
                gatewayResult: dtoOut.gatewayResult,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on dispatch payment split to gateway from webhook';
            return {
                dispatched: false,
                reason: message,
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
                errorMessage: message,
            };
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
            event.gatewayChargeId ??
            event.gatewayInvoiceId ??
            event.gatewaySubscriptionId);
    }
    async settleNativeSplitFromWebhookSafe(params) {
        if (params.paymentSplitId === null) {
            return {
                dispatched: false,
                nativeSettled: false,
                wasAlreadySettled: false,
                reason: 'paymentSplitId is required for native split settlement',
                paymentSplitId: null,
                sourceTransactionId: params.sourceTransactionId,
            };
        }
        try {
            const dtoOut = await this.markNativePaymentSplitAsTransferredService.exec(new mark_native_payment_split_as_transferred_dto_in_1.MarkNativePaymentSplitAsTransferredDtoIn({
                paymentSplitId: params.paymentSplitId,
                paymentTransactionId: params.paymentTransactionId,
                paymentWebhookEventId: params.paymentWebhookEventId,
                provider: params.provider,
                settlementMode: 'native_split',
                sourceTransactionId: params.sourceTransactionId,
                eventId: params.eventId,
                eventType: params.eventType,
                eventAction: params.eventAction,
                canonicalStatus: params.canonicalStatus,
                rawPayload: params.rawPayload,
                source: 'ProcessPaymentWebhookEventUseCase.nativeSplitSettlement',
            }));
            return {
                dispatched: false,
                nativeSettled: dtoOut.nativeSettled,
                wasAlreadySettled: dtoOut.wasAlreadySettled,
                reason: dtoOut.reason,
                paymentSplit: dtoOut.paymentSplit,
                paymentSplitRecipients: dtoOut.paymentSplitRecipients,
                paymentSplitId: dtoOut.paymentSplitId,
                sourceTransactionId: dtoOut.sourceTransactionId,
                gatewayResult: dtoOut.gatewayResult,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on native split settlement from webhook';
            return {
                dispatched: false,
                nativeSettled: false,
                wasAlreadySettled: false,
                reason: message,
                paymentSplitId: params.paymentSplitId,
                sourceTransactionId: params.sourceTransactionId,
                errorMessage: message,
            };
        }
    }
    isMercadoPagoProvider(provider) {
        return ['mercado_pago', 'mercadopago', 'mercado-pago'].includes(String(provider ?? '').trim().toLowerCase());
    }
    isPagSeguroProvider(provider) {
        return ['pagseguro', 'pagbank', 'pag_bank', 'pag-seguro'].includes(String(provider ?? '').trim().toLowerCase());
    }
    usesNativeSplitSettlement(provider) {
        return this.isMercadoPagoProvider(provider) || this.isPagSeguroProvider(provider);
    }
    isPaidWebhookStatus(status) {
        return ['paid', 'invoice_paid'].includes(String(status ?? '').trim());
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
        const normalizedProvider = String(params.event.provider ?? '')
            .trim()
            .toLowerCase();
        switch (normalizedProvider) {
            case 'stripe':
                return this.resolveStripeSplitDispatchDecision({
                    event: params.event,
                    paymentSplitId,
                });
            case 'mercado_pago':
            case 'mercadopago':
            case 'mercado-pago':
                return {
                    required: false,
                    reason: 'mercado_pago uses native split settlement from webhook; external gateway dispatch is not required',
                    sourceTransactionId: this.resolveGenericSourceTransactionId(params.event),
                    paymentSplitId,
                    authoritativeEvent: true,
                };
            case 'pagseguro':
                return {
                    required: false,
                    reason: 'pagseguro uses native split settlement from webhook; external gateway dispatch is not required',
                    sourceTransactionId: this.resolveGenericSourceTransactionId(params.event),
                    paymentSplitId,
                    authoritativeEvent: true,
                };
            case 'paypal':
                return {
                    required: false,
                    reason: 'paypal split dispatch is not implemented in webhook flow yet',
                    sourceTransactionId: null,
                    paymentSplitId,
                    authoritativeEvent: false,
                };
            case 'picpay':
                return {
                    required: false,
                    reason: 'picpay split dispatch is not implemented in webhook flow yet',
                    sourceTransactionId: null,
                    paymentSplitId,
                    authoritativeEvent: false,
                };
            case 'infinity_pay':
                return {
                    required: false,
                    reason: 'infinity_pay split dispatch is not implemented in webhook flow yet',
                    sourceTransactionId: null,
                    paymentSplitId,
                    authoritativeEvent: false,
                };
            default:
                return {
                    required: false,
                    reason: 'gateway provider does not support split dispatch in webhook flow',
                    sourceTransactionId: null,
                    paymentSplitId,
                    authoritativeEvent: false,
                };
        }
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
    async resolveSplitDispatchEligibilitySafe(params) {
        if (!params.initialDecision.required) {
            return {
                eligible: false,
                reason: params.initialDecision.reason,
                paymentSplitId: params.initialDecision.paymentSplitId,
                currentStatus: null,
                paymentSplit: null,
            };
        }
        if (params.initialDecision.paymentSplitId === null) {
            return {
                eligible: false,
                reason: 'payment split id not found in split dispatch decision',
                paymentSplitId: null,
                currentStatus: null,
                paymentSplit: null,
            };
        }
        const dtoOut = await this.resolvePaymentSplitDispatchEligibilityService.exec(new resolve_payment_split_dispatch_eligibility_dto_in_1.ResolvePaymentSplitDispatchEligibilityDtoIn({
            paymentSplitId: params.initialDecision.paymentSplitId,
            source: 'ProcessPaymentWebhookEventUseCase.resolveSplitDispatchEligibility',
        }));
        return {
            eligible: dtoOut.eligible,
            reason: dtoOut.reason,
            paymentSplitId: dtoOut.paymentSplitId,
            currentStatus: dtoOut.currentStatus,
            paymentSplit: dtoOut.paymentSplit,
        };
    }
    async reservePaymentSplitDispatchIfRequired(params) {
        if (!params.splitDispatchRequired) {
            return {
                reserved: false,
                reason: params.splitDispatchDecision.reason,
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                previousStatus: null,
                currentStatus: null,
                reservation: null,
            };
        }
        if (params.splitDispatchDecision.paymentSplitId === null) {
            return {
                reserved: false,
                reason: 'paymentSplitId is required to reserve split dispatch',
                paymentSplitId: null,
                previousStatus: null,
                currentStatus: null,
                reservation: null,
            };
        }
        if (params.splitDispatchDecision.sourceTransactionId === null) {
            return {
                reserved: false,
                reason: 'sourceTransactionId is required to reserve split dispatch',
                paymentSplitId: params.splitDispatchDecision.paymentSplitId,
                previousStatus: null,
                currentStatus: null,
                reservation: null,
            };
        }
        const dtoOut = await this.reservePaymentSplitDispatchService.exec(new reserve_payment_split_dispatch_dto_in_1.ReservePaymentSplitDispatchDtoIn({
            paymentSplitId: params.splitDispatchDecision.paymentSplitId,
            paymentTransactionId: params.paymentTransaction._id,
            provider: params.event.provider,
            sourceTransactionId: params.splitDispatchDecision.sourceTransactionId,
            webhookEventId: params.event.eventId,
            webhookEventType: params.event.eventType,
            source: 'ProcessPaymentWebhookEventUseCase.reservePaymentSplitDispatch',
        }));
        return {
            reserved: dtoOut.reserved,
            reason: dtoOut.reason,
            paymentSplitId: dtoOut.paymentSplitId,
            previousStatus: dtoOut.previousStatus,
            currentStatus: dtoOut.currentStatus,
            reservation: dtoOut.reservation,
        };
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
        resolve_payment_split_dispatch_eligibility_service_1.ResolvePaymentSplitDispatchEligibilityService,
        reserve_payment_split_dispatch_service_1.ReservePaymentSplitDispatchService,
        dispatch_payment_split_to_gateway_use_case_1.DispatchPaymentSplitToGatewayUseCase,
        mark_native_payment_split_as_transferred_service_1.MarkNativePaymentSplitAsTransferredService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessPaymentWebhookEventUseCase);
//# sourceMappingURL=process-payment-webhook-event.use-case.js.map