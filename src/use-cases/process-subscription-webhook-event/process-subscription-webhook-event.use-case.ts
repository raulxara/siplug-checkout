import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryDtoIn } from '../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import type {
  IPaymentWebhookEventsRepository,
  PaymentWebhookEventRow,
} from '../../modules/payment-webhook-events/entities/payment-webhook-events-repository.interface';
import { PAYMENT_WEBHOOK_EVENTS_REPOSITORY } from '../../modules/payment-webhook-events/tokens/payment-webhook-events.tokens';

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

import type {
  ISubscriptionCyclesRepository,
  SubscriptionCycleRow,
} from '../../modules/subscription-cycles/entities/subscription-cycles-repository.interface';
import { SUBSCRIPTION_CYCLES_REPOSITORY } from '../../modules/subscription-cycles/tokens/subscription-cycles.tokens';

import type {
  ISubscriptionInvoicesRepository,
  SubscriptionInvoiceRow,
} from '../../modules/subscription-invoices/entities/subscription-invoices-repository.interface';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from '../../modules/subscription-invoices/tokens/subscription-invoices.tokens';

import type {
  ISubscriptionsRepository,
  SubscriptionRow,
} from '../../modules/subscriptions/entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../modules/subscriptions/tokens/subscriptions.tokens';

import { ProcessSubscriptionWebhookEventDtoIn } from './dtos/process-subscription-webhook-event.dto-in';
import { ProcessSubscriptionWebhookEventDtoOut } from './dtos/process-subscription-webhook-event.dto-out';

type SubscriptionWebhookResolution = {
  subscription: SubscriptionRow | null;
  subscriptionInvoice: SubscriptionInvoiceRow | null;
  subscriptionCycle: SubscriptionCycleRow | null;
};

type SubscriptionWebhookStatusUpdate = {
  subscriptionStatus: string | null;
  subscriptionInvoiceStatus: string | null;
  subscriptionCycleStatus: string | null;
  subscriptionStartedAt: string | null;
  subscriptionCanceledAt: string | null;
  subscriptionEndedAt: string | null;
  invoicePaidAt: string | null;
  cycleProcessedAt: string | null;
  reason: string;
};

@Injectable()
export class ProcessSubscriptionWebhookEventUseCase {
  constructor(
    @Inject(PAYMENT_WEBHOOK_EVENTS_REPOSITORY)
    private readonly paymentWebhookEventsRepository: IPaymentWebhookEventsRepository,

    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly subscriptionsRepository: ISubscriptionsRepository,

    @Inject(SUBSCRIPTION_CYCLES_REPOSITORY)
    private readonly subscriptionCyclesRepository: ISubscriptionCyclesRepository,

    @Inject(SUBSCRIPTION_INVOICES_REPOSITORY)
    private readonly subscriptionInvoicesRepository: ISubscriptionInvoicesRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ProcessSubscriptionWebhookEventDtoIn,
  ): Promise<ProcessSubscriptionWebhookEventDtoOut> {
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

        return new ProcessSubscriptionWebhookEventDtoOut(
          paymentWebhookEvent,
          dtoIn.paymentTransaction,
          null,
          null,
          null,
          false,
          false,
          false,
          processingResult,
        );
      }

      const resolution = await this.resolveSubscriptionEntities(event);

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

        return new ProcessSubscriptionWebhookEventDtoOut(
          paymentWebhookEvent,
          dtoIn.paymentTransaction,
          null,
          resolution.subscriptionCycle as unknown as Record<string, unknown> | null,
          resolution.subscriptionInvoice as unknown as Record<string, unknown> | null,
          false,
          false,
          false,
          processingResult,
        );
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

        return new ProcessSubscriptionWebhookEventDtoOut(
          paymentWebhookEvent,
          dtoIn.paymentTransaction,
          resolution.subscription as unknown as Record<string, unknown>,
          resolution.subscriptionCycle as unknown as Record<string, unknown> | null,
          resolution.subscriptionInvoice as unknown as Record<string, unknown> | null,
          false,
          false,
          false,
          processingResult,
        );
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

        paymentTransactionId:
          this.toNullableString(dtoIn.paymentTransaction?._id) ??
          event.paymentTransactionId,

        checkoutSessionId: event.checkoutSessionId,

        gatewaySubscriptionId: event.gatewaySubscriptionId,
        gatewayInvoiceId: event.gatewayInvoiceId,

        subscriptionId: updatedSubscription._id,
        subscriptionInvoiceId:
          updatedInvoice?._id ?? resolution.subscriptionInvoice?._id ?? null,
        subscriptionCycleId:
          updatedCycle?._id ?? resolution.subscriptionCycle?._id ?? null,

        subscriptionUpdated: true,
        subscriptionInvoiceUpdated: updatedInvoice !== null,
        subscriptionCycleUpdated: updatedCycle !== null,

        subscriptionStatus: updatedSubscription.status,
        subscriptionInvoiceStatus:
          updatedInvoice?.status ?? resolution.subscriptionInvoice?.status ?? null,
        subscriptionCycleStatus:
          updatedCycle?.status ?? resolution.subscriptionCycle?.status ?? null,

        reason: statusUpdate.reason,
        paymentProcessingResult: dtoIn.paymentProcessingResult,
      };

      const paymentWebhookEvent = await this.updatePaymentWebhookEventResult({
        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
        processingResult,
        source: 'ProcessSubscriptionWebhookEventUseCase.processed',
      });

      return new ProcessSubscriptionWebhookEventDtoOut(
        paymentWebhookEvent,
        dtoIn.paymentTransaction,
        updatedSubscription as unknown as Record<string, unknown>,
        (updatedCycle ?? resolution.subscriptionCycle) as unknown as Record<
          string,
          unknown
        > | null,
        (updatedInvoice ?? resolution.subscriptionInvoice) as unknown as Record<
          string,
          unknown
        > | null,
        true,
        updatedCycle !== null,
        updatedInvoice !== null,
        processingResult,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on process subscription webhook event use case';

      await this.markPaymentWebhookEventAsFailedSafe({
        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
        errorMessage: message,
        normalizedEvent: dtoIn.normalizedEvent,
      });

      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ProcessSubscriptionWebhookEventUseCase',
          error,
          appFile: __filename,
          context: {
            paymentWebhookEventId: dtoIn.paymentWebhookEventId,
            provider: dtoIn.normalizedEvent.provider,
            eventId: dtoIn.normalizedEvent.eventId,
            canonicalStatus: dtoIn.normalizedEvent.canonicalStatus,
          },
        }),
      );

      throw new Error(message);
    }
  }

  private shouldProcessSubscriptionWebhook(
    event: NormalizedPaymentWebhookEventDto,
  ): boolean {
    if (
      event.subscriptionId !== null ||
      event.subscriptionInvoiceId !== null ||
      event.gatewaySubscriptionId !== null ||
      event.gatewayInvoiceId !== null
    ) {
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

  private async resolveSubscriptionEntities(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<SubscriptionWebhookResolution> {
    const subscriptionInvoice = await this.resolveSubscriptionInvoice(event);

    const subscription =
      (await this.resolveSubscriptionByEvent(event)) ??
      (subscriptionInvoice !== null
        ? await this.findSubscriptionByUniqueIdSafe(
            subscriptionInvoice.subscriptionId,
          )
        : null);

    const subscriptionCycle =
        subscriptionInvoice !== null && subscriptionInvoice.subscriptionCycleId !== null
            ? await this.findSubscriptionCycleByUniqueIdSafe(
                subscriptionInvoice.subscriptionCycleId,
            )
            : null;

    return {
      subscription,
      subscriptionInvoice,
      subscriptionCycle,
    };
  }

  private async resolveSubscriptionInvoice(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<SubscriptionInvoiceRow | null> {
    if (event.subscriptionInvoiceId !== null) {
      const found = await this.findSubscriptionInvoiceByUniqueIdSafe(
        event.subscriptionInvoiceId,
      );

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  private async resolveSubscriptionByEvent(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<SubscriptionRow | null> {
    if (event.subscriptionId !== null) {
      const found = await this.findSubscriptionByUniqueIdSafe(
        event.subscriptionId,
      );

      if (found !== null) {
        return found;
      }
    }

    return null;
  }

  private resolveSubscriptionStatusUpdate(params: {
    event: NormalizedPaymentWebhookEventDto;
    resolution: SubscriptionWebhookResolution;
  }): SubscriptionWebhookStatusUpdate | null {
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

  private async updateSubscriptionInvoiceIfNeeded(params: {
    event: NormalizedPaymentWebhookEventDto;
    paymentTransaction: Record<string, unknown> | null;
    subscriptionInvoice: SubscriptionInvoiceRow | null;
    statusUpdate: SubscriptionWebhookStatusUpdate;
  }): Promise<SubscriptionInvoiceRow | null> {
    if (
      params.subscriptionInvoice === null ||
      params.statusUpdate.subscriptionInvoiceStatus === null
    ) {
      return null;
    }

    if (
      params.subscriptionInvoice.status ===
        params.statusUpdate.subscriptionInvoiceStatus &&
      params.subscriptionInvoice.paidAt === params.statusUpdate.invoicePaidAt &&
      params.subscriptionInvoice.gatewayInvoiceId === params.event.gatewayInvoiceId
    ) {
      return null;
    }

    const paymentTransactionId =
      this.toNullableString(params.paymentTransaction?._id) ??
      params.event.paymentTransactionId ??
      params.subscriptionInvoice.paymentTransactionId;

    const gatewayInvoiceId =
      params.event.gatewayInvoiceId ??
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

    const changesHistory = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
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
      }),
    );

    const updated = await this.subscriptionInvoicesRepository.updateByUniqueId(
      params.subscriptionInvoice._id,
      {
        payment_transaction_id: paymentTransactionId,
        gateway_invoice_id: gatewayInvoiceId,
        paid_at: params.statusUpdate.invoicePaidAt,
        metadata: newData.metadata,
        config: newData.config,
        status: params.statusUpdate.subscriptionInvoiceStatus,
        changes_history: changesHistory.hasChanges
          ? changesHistory.changesHistory
          : params.subscriptionInvoice.changesHistory,
      },
    );

    return updated;
  }

  private async updateSubscriptionCycleIfNeeded(params: {
    event: NormalizedPaymentWebhookEventDto;
    subscriptionCycle: SubscriptionCycleRow | null;
    statusUpdate: SubscriptionWebhookStatusUpdate;
  }): Promise<SubscriptionCycleRow | null> {
    if (
      params.subscriptionCycle === null ||
      params.statusUpdate.subscriptionCycleStatus === null
    ) {
      return null;
    }

    if (
      params.subscriptionCycle.status === params.statusUpdate.subscriptionCycleStatus
    ) {
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

    const changesHistory = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
        currentChangesHistory: params.subscriptionCycle.changesHistory,
        oldData: {
          processedAt: params.subscriptionCycle.processedAt,
          metadata: params.subscriptionCycle.metadata,
          config: params.subscriptionCycle.config,
          status: params.subscriptionCycle.status,
        },
        newData,
        source: 'ProcessSubscriptionWebhookEventUseCase.updateSubscriptionCycle',
      }),
    );

    const updated = await this.subscriptionCyclesRepository.updateByUniqueId(
      params.subscriptionCycle._id,
      {
        processed_at: params.statusUpdate.cycleProcessedAt,
        metadata: newData.metadata,
        config: newData.config,
        status: params.statusUpdate.subscriptionCycleStatus,
        changes_history: changesHistory.hasChanges
          ? changesHistory.changesHistory
          : params.subscriptionCycle.changesHistory,
      },
    );

    return updated;
  }

  private async updateSubscriptionIfNeeded(params: {
    event: NormalizedPaymentWebhookEventDto;
    subscription: SubscriptionRow;
    subscriptionCycle: SubscriptionCycleRow | null;
    statusUpdate: SubscriptionWebhookStatusUpdate;
  }): Promise<SubscriptionRow> {
    const currentCycle = this.resolveCurrentCycle({
      subscription: params.subscription,
      subscriptionCycle: params.subscriptionCycle,
    });

    const gatewaySubscriptionId =
      params.event.gatewaySubscriptionId ??
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

    const changesHistory = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
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
      }),
    );

    const updated = await this.subscriptionsRepository.updateByUniqueId(
      params.subscription._id,
      {
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
      },
    );

    return updated;
  }

  private async updatePaymentWebhookEventResult(params: {
    paymentWebhookEventId: string;
    processingResult: Record<string, unknown>;
    source: string;
  }): Promise<Record<string, unknown>> {
    const current = await this.paymentWebhookEventsRepository.findByUniqueId(
      params.paymentWebhookEventId,
    );

    if (current === null) {
      throw new Error('payment webhook event not found');
    }

    const mergedProcessingResult = {
      ...this.asObject(current.processingResult),
      subscriptionProcessingResult: params.processingResult,
    };

    const changesHistory = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
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
      }),
    );

    const updated = await this.paymentWebhookEventsRepository.updateByUniqueId(
      params.paymentWebhookEventId,
      {
        processing_result: mergedProcessingResult,
        processed_at: current.processedAt ?? new Date().toISOString(),
        status: 'processed',
        changes_history: changesHistory.hasChanges
          ? changesHistory.changesHistory
          : current.changesHistory,
      },
    );

    return updated as unknown as Record<string, unknown>;
  }

  private async markPaymentWebhookEventAsFailedSafe(params: {
    paymentWebhookEventId: string;
    errorMessage: string;
    normalizedEvent: NormalizedPaymentWebhookEventDto;
  }): Promise<void> {
    try {
      const current =
        await this.paymentWebhookEventsRepository.findByUniqueId(
          params.paymentWebhookEventId,
        );

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

      const changesHistory = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
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
        }),
      );

      await this.paymentWebhookEventsRepository.updateByUniqueId(
        params.paymentWebhookEventId,
        {
          processing_result: processingResult,
          error_message: params.errorMessage,
          status: 'failed',
          changes_history: changesHistory.hasChanges
            ? changesHistory.changesHistory
            : current.changesHistory,
        },
      );
    } catch {
      // não lança erro aqui para não ocultar o erro original
    }
  }

  private async findSubscriptionByUniqueIdSafe(
    subscriptionId: string,
  ): Promise<SubscriptionRow | null> {
    try {
      return await this.subscriptionsRepository.findByUniqueId(subscriptionId);
    } catch {
      return null;
    }
  }

  private async findSubscriptionInvoiceByUniqueIdSafe(
    subscriptionInvoiceId: string,
  ): Promise<SubscriptionInvoiceRow | null> {
    try {
      return await this.subscriptionInvoicesRepository.findByUniqueId(
        subscriptionInvoiceId,
      );
    } catch {
      return null;
    }
  }

  private async findSubscriptionCycleByUniqueIdSafe(
    subscriptionCycleId: string,
  ): Promise<SubscriptionCycleRow | null> {
    try {
      return await this.subscriptionCyclesRepository.findByUniqueId(
        subscriptionCycleId,
      );
    } catch {
      return null;
    }
  }

  private resolveCurrentCycle(params: {
    subscription: SubscriptionRow;
    subscriptionCycle: SubscriptionCycleRow | null;
  }): number {
    if (params.subscriptionCycle === null) {
      return params.subscription.currentCycle;
    }

    if (params.subscriptionCycle.cycleNumber > params.subscription.currentCycle) {
      return params.subscriptionCycle.cycleNumber;
    }

    return params.subscription.currentCycle;
  }

  private buildIgnoredProcessingResult(params: {
    reason: string;
    event: NormalizedPaymentWebhookEventDto;
    paymentProcessingResult: Record<string, unknown> | null;
    subscription?: SubscriptionRow | null;
    subscriptionInvoice?: SubscriptionInvoiceRow | null;
    subscriptionCycle?: SubscriptionCycleRow | null;
  }): Record<string, unknown> {
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
      subscriptionInvoiceId:
        params.subscriptionInvoice?._id ?? params.event.subscriptionInvoiceId,
      subscriptionCycleId: params.subscriptionCycle?._id ?? null,
      paymentProcessingResult: params.paymentProcessingResult,
    };
  }

  private mergeMetadata(params: {
    current: Record<string, unknown> | null;
    event: NormalizedPaymentWebhookEventDto;
    entity: string;
  }): Record<string, unknown> {
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

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}