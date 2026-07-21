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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessSubscriptionWebhookEventUseCase = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_dto_in_1 = require("../../common/services/changes-history/dtos/build-changes-history.dto-in");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const payment_webhook_events_tokens_1 = require("../../modules/payment-webhook-events/tokens/payment-webhook-events.tokens");
const subscription_cycles_tokens_1 = require("../../modules/subscription-cycles/tokens/subscription-cycles.tokens");
const subscription_invoices_tokens_1 = require("../../modules/subscription-invoices/tokens/subscription-invoices.tokens");
const subscriptions_tokens_1 = require("../../modules/subscriptions/tokens/subscriptions.tokens");
const process_subscription_webhook_event_dto_out_1 = require("./dtos/process-subscription-webhook-event.dto-out");
let ProcessSubscriptionWebhookEventUseCase = class ProcessSubscriptionWebhookEventUseCase {
    paymentWebhookEventsRepository;
    subscriptionsRepository;
    subscriptionCyclesRepository;
    subscriptionInvoicesRepository;
    buildChangesHistoryService;
    handleUseCaseExceptionService;
    constructor(paymentWebhookEventsRepository, subscriptionsRepository, subscriptionCyclesRepository, subscriptionInvoicesRepository, buildChangesHistoryService, handleUseCaseExceptionService) {
        this.paymentWebhookEventsRepository = paymentWebhookEventsRepository;
        this.subscriptionsRepository = subscriptionsRepository;
        this.subscriptionCyclesRepository = subscriptionCyclesRepository;
        this.subscriptionInvoicesRepository = subscriptionInvoicesRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            const event = dtoIn.normalizedEvent;
            if (!this.shouldProcessSubscriptionWebhook(event)) {
                const processingResult = this.buildIgnoredProcessingResult({
                    reason: 'webhook event is not related to subscription processing',
                    event,
                    paymentProcessingResult: dtoIn.paymentProcessingResult,
                });
                const paymentWebhookEvent = await this.updatePaymentWebhookEventResult({
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    processingResult,
                    source: 'ProcessSubscriptionWebhookEventUseCase.ignored',
                });
                return new process_subscription_webhook_event_dto_out_1.ProcessSubscriptionWebhookEventDtoOut(paymentWebhookEvent, dtoIn.paymentTransaction, null, null, null, false, false, false, processingResult);
            }
            const resolution = await this.resolveSubscriptionEntities({
                event,
                paymentTransaction: dtoIn.paymentTransaction,
            });
            if (resolution.subscription === null) {
                const processingResult = this.buildIgnoredProcessingResult({
                    reason: 'subscription not found for webhook event',
                    event,
                    paymentProcessingResult: dtoIn.paymentProcessingResult,
                });
                const paymentWebhookEvent = await this.updatePaymentWebhookEventResult({
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    processingResult,
                    source: 'ProcessSubscriptionWebhookEventUseCase.subscriptionNotFound',
                });
                return new process_subscription_webhook_event_dto_out_1.ProcessSubscriptionWebhookEventDtoOut(paymentWebhookEvent, dtoIn.paymentTransaction, null, resolution.subscriptionCycle, resolution.subscriptionInvoice, false, false, false, processingResult);
            }
            const statusUpdate = this.resolveSubscriptionStatusUpdate({
                event,
                resolution,
            });
            if (statusUpdate === null) {
                const processingResult = this.buildIgnoredProcessingResult({
                    reason: 'webhook canonical status does not update subscription entities',
                    event,
                    paymentProcessingResult: dtoIn.paymentProcessingResult,
                    subscription: resolution.subscription,
                    subscriptionInvoice: resolution.subscriptionInvoice,
                    subscriptionCycle: resolution.subscriptionCycle,
                });
                const paymentWebhookEvent = await this.updatePaymentWebhookEventResult({
                    paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                    processingResult,
                    source: 'ProcessSubscriptionWebhookEventUseCase.statusIgnored',
                });
                return new process_subscription_webhook_event_dto_out_1.ProcessSubscriptionWebhookEventDtoOut(paymentWebhookEvent, dtoIn.paymentTransaction, resolution.subscription, resolution.subscriptionCycle, resolution.subscriptionInvoice, false, false, false, processingResult);
            }
            const updatedInvoice = await this.updateSubscriptionInvoiceIfNeeded({
                event,
                paymentTransaction: dtoIn.paymentTransaction,
                subscriptionInvoice: resolution.subscriptionInvoice,
                statusUpdate,
            });
            const updatedCycle = await this.updateSubscriptionCycleIfNeeded({
                event,
                subscriptionCycle: resolution.subscriptionCycle,
                statusUpdate,
            });
            const updatedSubscription = await this.updateSubscriptionIfNeeded({
                event,
                subscription: resolution.subscription,
                subscriptionCycle: updatedCycle ?? resolution.subscriptionCycle,
                statusUpdate,
            });
            const processingResult = {
                ignored: false,
                provider: event.provider,
                eventId: event.eventId,
                eventType: event.eventType,
                eventAction: event.eventAction,
                canonicalStatus: event.canonicalStatus,
                paymentTransactionId: this.toNullableString(dtoIn.paymentTransaction?._id) ??
                    event.paymentTransactionId,
                checkoutSessionId: event.checkoutSessionId,
                gatewaySubscriptionId: event.gatewaySubscriptionId,
                gatewayInvoiceId: event.gatewayInvoiceId,
                subscriptionId: updatedSubscription._id,
                subscriptionInvoiceId: updatedInvoice?._id ?? resolution.subscriptionInvoice?._id ?? null,
                subscriptionCycleId: updatedCycle?._id ?? resolution.subscriptionCycle?._id ?? null,
                subscriptionUpdated: true,
                subscriptionInvoiceUpdated: updatedInvoice !== null,
                subscriptionCycleUpdated: updatedCycle !== null,
                subscriptionStatus: updatedSubscription.status,
                subscriptionInvoiceStatus: updatedInvoice?.status ?? resolution.subscriptionInvoice?.status ?? null,
                subscriptionCycleStatus: updatedCycle?.status ?? resolution.subscriptionCycle?.status ?? null,
                reason: statusUpdate.reason,
                paymentProcessingResult: dtoIn.paymentProcessingResult,
            };
            const paymentWebhookEvent = await this.updatePaymentWebhookEventResult({
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                processingResult,
                source: 'ProcessSubscriptionWebhookEventUseCase.processed',
            });
            return new process_subscription_webhook_event_dto_out_1.ProcessSubscriptionWebhookEventDtoOut(paymentWebhookEvent, dtoIn.paymentTransaction, updatedSubscription, (updatedCycle ?? resolution.subscriptionCycle), (updatedInvoice ?? resolution.subscriptionInvoice), true, updatedCycle !== null, updatedInvoice !== null, processingResult);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on process subscription webhook event use case';
            await this.markPaymentWebhookEventAsFailedSafe({
                paymentWebhookEventId: dtoIn.paymentWebhookEventId,
                errorMessage: message,
                normalizedEvent: dtoIn.normalizedEvent,
            });
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ProcessSubscriptionWebhookEventUseCase',
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
    shouldProcessSubscriptionWebhook(event) {
        if (event.subscriptionId !== null ||
            event.subscriptionInvoiceId !== null ||
            event.gatewaySubscriptionId !== null ||
            event.gatewayInvoiceId !== null) {
            return true;
        }
        const subscriptionStatuses = [
            'invoice_paid',
            'invoice_payment_failed',
            'subscription_active',
            'subscription_canceled',
        ];
        return subscriptionStatuses.includes(event.canonicalStatus);
    }
    async resolveSubscriptionEntities(params) {
        const subscriptionByEvent = await this.resolveSubscriptionByEvent(params.event);
        const subscriptionInvoice = await this.resolveSubscriptionInvoice({
            event: params.event,
            paymentTransaction: params.paymentTransaction,
            subscription: subscriptionByEvent,
        });
        const subscription = subscriptionByEvent ??
            (subscriptionInvoice !== null
                ? await this.findSubscriptionByUniqueIdSafe(subscriptionInvoice.subscriptionId)
                : null);
        const subscriptionCycle = subscriptionInvoice !== null &&
            subscriptionInvoice.subscriptionCycleId !== null
            ? await this.findSubscriptionCycleByUniqueIdSafe(subscriptionInvoice.subscriptionCycleId)
            : null;
        return {
            subscription,
            subscriptionInvoice,
            subscriptionCycle,
        };
    }
    async resolveSubscriptionInvoice(params) {
        if (params.event.subscriptionInvoiceId !== null) {
            const found = await this.findSubscriptionInvoiceByUniqueIdSafe(params.event.subscriptionInvoiceId);
            if (found !== null) {
                return found;
            }
        }
        const paymentTransactionId = this.toNullableString(params.paymentTransaction?._id) ??
            params.event.paymentTransactionId;
        if (paymentTransactionId !== null) {
            const found = await this.findSubscriptionInvoiceByPaymentTransactionIdSafe(paymentTransactionId);
            if (found !== null) {
                return found;
            }
        }
        if (params.event.gatewayInvoiceId !== null) {
            const found = await this.findSubscriptionInvoiceByGatewayInvoiceIdSafe(params.event.gatewayInvoiceId);
            if (found !== null) {
                return found;
            }
        }
        if (params.subscription !== null &&
            this.shouldResolveLatestInvoiceFromSubscription(params.event.canonicalStatus)) {
            const found = await this.findLatestSubscriptionInvoiceBySubscriptionIdSafe(params.subscription._id);
            if (found !== null) {
                return found;
            }
        }
        return null;
    }
    async findSubscriptionInvoiceByPaymentTransactionIdSafe(paymentTransactionId) {
        try {
            return await this.subscriptionInvoicesRepository.findByPaymentTransactionId(paymentTransactionId);
        }
        catch {
            return null;
        }
    }
    async findSubscriptionInvoiceByGatewayInvoiceIdSafe(gatewayInvoiceId) {
        try {
            return await this.subscriptionInvoicesRepository.findByGatewayInvoiceId(gatewayInvoiceId);
        }
        catch {
            return null;
        }
    }
    async findLatestSubscriptionInvoiceBySubscriptionIdSafe(subscriptionId) {
        try {
            return await this.subscriptionInvoicesRepository.findLatestBySubscriptionId(subscriptionId);
        }
        catch {
            return null;
        }
    }
    shouldResolveLatestInvoiceFromSubscription(canonicalStatus) {
        return [
            'paid',
            'invoice_paid',
            'subscription_invoice_paid',
            'failed',
            'payment_failed',
            'invoice_payment_failed',
            'subscription_invoice_failed',
        ].includes(canonicalStatus);
    }
    async resolveSubscriptionByEvent(event) {
        if (event.subscriptionId !== null) {
            const found = await this.findSubscriptionByUniqueIdSafe(event.subscriptionId);
            if (found !== null) {
                return found;
            }
        }
        return null;
    }
    resolveSubscriptionStatusUpdate(params) {
        const now = new Date().toISOString();
        const currentSubscription = params.resolution.subscription;
        switch (params.event.canonicalStatus) {
            case 'invoice_paid':
            case 'paid':
                if (params.resolution.subscriptionInvoice === null) {
                    return null;
                }
                return {
                    subscriptionStatus: 'active',
                    subscriptionInvoiceStatus: 'paid',
                    subscriptionCycleStatus: 'paid',
                    subscriptionStartedAt: currentSubscription?.startedAt ?? now,
                    subscriptionCanceledAt: currentSubscription?.canceledAt ?? null,
                    subscriptionEndedAt: currentSubscription?.endedAt ?? null,
                    invoicePaidAt: params.resolution.subscriptionInvoice.paidAt ?? now,
                    cycleProcessedAt: now,
                    reason: 'subscription invoice paid by gateway webhook',
                };
            case 'invoice_payment_failed':
            case 'failed':
                if (params.resolution.subscriptionInvoice === null) {
                    return null;
                }
                return {
                    subscriptionStatus: 'past_due',
                    subscriptionInvoiceStatus: 'failed',
                    subscriptionCycleStatus: 'failed',
                    subscriptionStartedAt: currentSubscription?.startedAt ?? null,
                    subscriptionCanceledAt: currentSubscription?.canceledAt ?? null,
                    subscriptionEndedAt: currentSubscription?.endedAt ?? null,
                    invoicePaidAt: params.resolution.subscriptionInvoice.paidAt,
                    cycleProcessedAt: now,
                    reason: 'subscription invoice payment failed by gateway webhook',
                };
            case 'subscription_active':
                return {
                    subscriptionStatus: 'active',
                    subscriptionInvoiceStatus: null,
                    subscriptionCycleStatus: null,
                    subscriptionStartedAt: currentSubscription?.startedAt ?? now,
                    subscriptionCanceledAt: currentSubscription?.canceledAt ?? null,
                    subscriptionEndedAt: currentSubscription?.endedAt ?? null,
                    invoicePaidAt: null,
                    cycleProcessedAt: null,
                    reason: 'subscription marked as active by gateway webhook',
                };
            case 'subscription_canceled':
            case 'canceled':
                return {
                    subscriptionStatus: 'canceled',
                    subscriptionInvoiceStatus: null,
                    subscriptionCycleStatus: null,
                    subscriptionStartedAt: currentSubscription?.startedAt ?? null,
                    subscriptionCanceledAt: currentSubscription?.canceledAt ?? now,
                    subscriptionEndedAt: currentSubscription?.endedAt ?? now,
                    invoicePaidAt: null,
                    cycleProcessedAt: null,
                    reason: 'subscription marked as canceled by gateway webhook',
                };
            default:
                return null;
        }
    }
    async updateSubscriptionInvoiceIfNeeded(params) {
        if (params.subscriptionInvoice === null ||
            params.statusUpdate.subscriptionInvoiceStatus === null) {
            return null;
        }
        if (params.subscriptionInvoice.status ===
            params.statusUpdate.subscriptionInvoiceStatus &&
            params.subscriptionInvoice.paidAt === params.statusUpdate.invoicePaidAt &&
            params.subscriptionInvoice.gatewayInvoiceId === params.event.gatewayInvoiceId) {
            return null;
        }
        const paymentTransactionId = this.toNullableString(params.paymentTransaction?._id) ??
            params.event.paymentTransactionId ??
            params.subscriptionInvoice.paymentTransactionId;
        const gatewayInvoiceId = params.event.gatewayInvoiceId ??
            params.subscriptionInvoice.gatewayInvoiceId;
        const newData = {
            paymentTransactionId,
            gatewayInvoiceId,
            paidAt: params.statusUpdate.invoicePaidAt,
            status: params.statusUpdate.subscriptionInvoiceStatus,
            metadata: this.mergeMetadata({
                current: params.subscriptionInvoice.metadata,
                event: params.event,
                entity: 'subscription_invoice',
            }),
            config: params.subscriptionInvoice.config,
        };
        const changesHistory = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: params.subscriptionInvoice.changesHistory,
            oldData: {
                paymentTransactionId: params.subscriptionInvoice.paymentTransactionId,
                gatewayInvoiceId: params.subscriptionInvoice.gatewayInvoiceId,
                paidAt: params.subscriptionInvoice.paidAt,
                status: params.subscriptionInvoice.status,
                metadata: params.subscriptionInvoice.metadata,
                config: params.subscriptionInvoice.config,
            },
            newData,
            source: 'ProcessSubscriptionWebhookEventUseCase.updateSubscriptionInvoice',
        }));
        const updated = await this.subscriptionInvoicesRepository.updateByUniqueId(params.subscriptionInvoice._id, {
            payment_transaction_id: paymentTransactionId,
            gateway_invoice_id: gatewayInvoiceId,
            paid_at: params.statusUpdate.invoicePaidAt,
            metadata: newData.metadata,
            config: newData.config,
            status: params.statusUpdate.subscriptionInvoiceStatus,
            changes_history: changesHistory.hasChanges
                ? changesHistory.changesHistory
                : params.subscriptionInvoice.changesHistory,
        });
        return updated;
    }
    async updateSubscriptionCycleIfNeeded(params) {
        if (params.subscriptionCycle === null ||
            params.statusUpdate.subscriptionCycleStatus === null) {
            return null;
        }
        if (params.subscriptionCycle.status === params.statusUpdate.subscriptionCycleStatus) {
            return null;
        }
        const newData = {
            processedAt: params.statusUpdate.cycleProcessedAt,
            metadata: this.mergeMetadata({
                current: params.subscriptionCycle.metadata,
                event: params.event,
                entity: 'subscription_cycle',
            }),
            config: params.subscriptionCycle.config,
            status: params.statusUpdate.subscriptionCycleStatus,
        };
        const changesHistory = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: params.subscriptionCycle.changesHistory,
            oldData: {
                processedAt: params.subscriptionCycle.processedAt,
                metadata: params.subscriptionCycle.metadata,
                config: params.subscriptionCycle.config,
                status: params.subscriptionCycle.status,
            },
            newData,
            source: 'ProcessSubscriptionWebhookEventUseCase.updateSubscriptionCycle',
        }));
        const updated = await this.subscriptionCyclesRepository.updateByUniqueId(params.subscriptionCycle._id, {
            processed_at: params.statusUpdate.cycleProcessedAt,
            metadata: newData.metadata,
            config: newData.config,
            status: params.statusUpdate.subscriptionCycleStatus,
            changes_history: changesHistory.hasChanges
                ? changesHistory.changesHistory
                : params.subscriptionCycle.changesHistory,
        });
        return updated;
    }
    async updateSubscriptionIfNeeded(params) {
        const currentCycle = this.resolveCurrentCycle({
            subscription: params.subscription,
            subscriptionCycle: params.subscriptionCycle,
        });
        const gatewaySubscriptionId = params.event.gatewaySubscriptionId ??
            params.subscription.gatewaySubscriptionId;
        const newData = {
            currentCycle,
            startedAt: params.statusUpdate.subscriptionStartedAt,
            canceledAt: params.statusUpdate.subscriptionCanceledAt,
            endedAt: params.statusUpdate.subscriptionEndedAt,
            metadata: this.mergeMetadata({
                current: params.subscription.metadata,
                event: params.event,
                entity: 'subscription',
            }),
            config: {
                ...(params.subscription.config ?? {}),
                gatewaySubscriptionId,
                lastGatewayInvoiceId: params.event.gatewayInvoiceId,
                lastSubscriptionWebhookEventId: params.event.eventId,
            },
            status: params.statusUpdate.subscriptionStatus ?? params.subscription.status,
            gatewaySubscriptionId,
        };
        const changesHistory = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: params.subscription.changesHistory,
            oldData: {
                currentCycle: params.subscription.currentCycle,
                startedAt: params.subscription.startedAt,
                canceledAt: params.subscription.canceledAt,
                endedAt: params.subscription.endedAt,
                metadata: params.subscription.metadata,
                config: params.subscription.config,
                status: params.subscription.status,
                gatewaySubscriptionId: params.subscription.gatewaySubscriptionId,
            },
            newData,
            source: 'ProcessSubscriptionWebhookEventUseCase.updateSubscription',
        }));
        const updated = await this.subscriptionsRepository.updateByUniqueId(params.subscription._id, {
            current_cycle: newData.currentCycle,
            started_at: newData.startedAt,
            canceled_at: newData.canceledAt,
            ended_at: newData.endedAt,
            metadata: newData.metadata,
            config: newData.config,
            status: newData.status,
            gateway_subscription_id: newData.gatewaySubscriptionId,
            changes_history: changesHistory.hasChanges
                ? changesHistory.changesHistory
                : params.subscription.changesHistory,
        });
        return updated;
    }
    async updatePaymentWebhookEventResult(params) {
        const current = await this.paymentWebhookEventsRepository.findByUniqueId(params.paymentWebhookEventId);
        if (current === null) {
            throw new Error('payment webhook event not found');
        }
        const mergedProcessingResult = {
            ...this.asObject(current.processingResult),
            subscriptionProcessingResult: params.processingResult,
        };
        const changesHistory = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
            currentChangesHistory: current.changesHistory,
            oldData: {
                processingResult: current.processingResult,
                status: current.status,
                processedAt: current.processedAt,
            },
            newData: {
                processingResult: mergedProcessingResult,
                status: 'processed',
                processedAt: current.processedAt ?? new Date().toISOString(),
            },
            source: params.source,
        }));
        const updated = await this.paymentWebhookEventsRepository.updateByUniqueId(params.paymentWebhookEventId, {
            processing_result: mergedProcessingResult,
            processed_at: current.processedAt ?? new Date().toISOString(),
            status: 'processed',
            changes_history: changesHistory.hasChanges
                ? changesHistory.changesHistory
                : current.changesHistory,
        });
        return updated;
    }
    async markPaymentWebhookEventAsFailedSafe(params) {
        try {
            const current = await this.paymentWebhookEventsRepository.findByUniqueId(params.paymentWebhookEventId);
            if (current === null) {
                return;
            }
            const processingResult = {
                ...this.asObject(current.processingResult),
                subscriptionProcessingResult: {
                    provider: params.normalizedEvent.provider,
                    eventId: params.normalizedEvent.eventId,
                    canonicalStatus: params.normalizedEvent.canonicalStatus,
                    errorMessage: params.errorMessage,
                },
            };
            const changesHistory = this.buildChangesHistoryService.exec(new build_changes_history_dto_in_1.BuildChangesHistoryDtoIn({
                currentChangesHistory: current.changesHistory,
                oldData: {
                    processingResult: current.processingResult,
                    errorMessage: current.errorMessage,
                    status: current.status,
                },
                newData: {
                    processingResult,
                    errorMessage: params.errorMessage,
                    status: 'failed',
                },
                source: 'ProcessSubscriptionWebhookEventUseCase.failed',
            }));
            await this.paymentWebhookEventsRepository.updateByUniqueId(params.paymentWebhookEventId, {
                processing_result: processingResult,
                error_message: params.errorMessage,
                status: 'failed',
                changes_history: changesHistory.hasChanges
                    ? changesHistory.changesHistory
                    : current.changesHistory,
            });
        }
        catch {
        }
    }
    async findSubscriptionByUniqueIdSafe(subscriptionId) {
        try {
            return await this.subscriptionsRepository.findByUniqueId(subscriptionId);
        }
        catch {
            return null;
        }
    }
    async findSubscriptionInvoiceByUniqueIdSafe(subscriptionInvoiceId) {
        try {
            return await this.subscriptionInvoicesRepository.findByUniqueId(subscriptionInvoiceId);
        }
        catch {
            return null;
        }
    }
    async findSubscriptionCycleByUniqueIdSafe(subscriptionCycleId) {
        try {
            return await this.subscriptionCyclesRepository.findByUniqueId(subscriptionCycleId);
        }
        catch {
            return null;
        }
    }
    resolveCurrentCycle(params) {
        if (params.subscriptionCycle === null) {
            return params.subscription.currentCycle;
        }
        if (params.subscriptionCycle.cycleNumber > params.subscription.currentCycle) {
            return params.subscriptionCycle.cycleNumber;
        }
        return params.subscription.currentCycle;
    }
    buildIgnoredProcessingResult(params) {
        return {
            ignored: true,
            reason: params.reason,
            provider: params.event.provider,
            eventId: params.event.eventId,
            eventType: params.event.eventType,
            eventAction: params.event.eventAction,
            canonicalStatus: params.event.canonicalStatus,
            paymentTransactionId: params.event.paymentTransactionId,
            checkoutSessionId: params.event.checkoutSessionId,
            gatewaySubscriptionId: params.event.gatewaySubscriptionId,
            gatewayInvoiceId: params.event.gatewayInvoiceId,
            subscriptionId: params.subscription?._id ?? params.event.subscriptionId,
            subscriptionInvoiceId: params.subscriptionInvoice?._id ?? params.event.subscriptionInvoiceId,
            subscriptionCycleId: params.subscriptionCycle?._id ?? null,
            paymentProcessingResult: params.paymentProcessingResult,
        };
    }
    mergeMetadata(params) {
        return {
            ...(params.current ?? {}),
            lastSubscriptionWebhook: {
                entity: params.entity,
                provider: params.event.provider,
                eventId: params.event.eventId,
                eventType: params.event.eventType,
                eventAction: params.event.eventAction,
                canonicalStatus: params.event.canonicalStatus,
                gatewaySubscriptionId: params.event.gatewaySubscriptionId,
                gatewayInvoiceId: params.event.gatewayInvoiceId,
                processedAt: new Date().toISOString(),
            },
        };
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
};
exports.ProcessSubscriptionWebhookEventUseCase = ProcessSubscriptionWebhookEventUseCase;
exports.ProcessSubscriptionWebhookEventUseCase = ProcessSubscriptionWebhookEventUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_webhook_events_tokens_1.PAYMENT_WEBHOOK_EVENTS_REPOSITORY)),
    __param(1, (0, common_1.Inject)(subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY)),
    __param(2, (0, common_1.Inject)(subscription_cycles_tokens_1.SUBSCRIPTION_CYCLES_REPOSITORY)),
    __param(3, (0, common_1.Inject)(subscription_invoices_tokens_1.SUBSCRIPTION_INVOICES_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, build_changes_history_service_1.BuildChangesHistoryService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessSubscriptionWebhookEventUseCase);
//# sourceMappingURL=process-subscription-webhook-event.use-case.js.map