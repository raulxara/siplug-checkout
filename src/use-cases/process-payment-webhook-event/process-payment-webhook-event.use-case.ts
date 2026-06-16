import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { MarkPaymentWebhookEventAsFailedDtoIn } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-failed/dtos/mark-payment-webhook-event-as-failed.dto-in';
import { MarkPaymentWebhookEventAsFailedService } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-failed/mark-payment-webhook-event-as-failed.service';
import { MarkPaymentWebhookEventAsProcessedDtoIn } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processed/dtos/mark-payment-webhook-event-as-processed.dto-in';
import { MarkPaymentWebhookEventAsProcessedService } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processed/mark-payment-webhook-event-as-processed.service';
import { MarkPaymentWebhookEventAsProcessingDtoIn } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processing/dtos/mark-payment-webhook-event-as-processing.dto-in';
import { MarkPaymentWebhookEventAsProcessingService } from '../../modules/payment-webhook-events/services/mark-payment-webhook-event-as-processing/mark-payment-webhook-event-as-processing.service';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { GetAllPaymentTransactionsByCheckoutSessionIdDtoIn } from '../../modules/payment-transactions/services/get-all-payment-transactions-by-checkout-session-id/dtos/get-all-payment-transactions-by-checkout-session-id.dto-in';
import { GetAllPaymentTransactionsByCheckoutSessionIdService } from '../../modules/payment-transactions/services/get-all-payment-transactions-by-checkout-session-id/get-all-payment-transactions-by-checkout-session-id.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ProcessPaymentWebhookEventDtoIn } from './dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventDtoOut } from './dtos/process-payment-webhook-event.dto-out';

type TransactionStatusUpdate = {
  status: string;
  processStatus: string;
  processMessage: string;
  gatewayStatus: string;
  paidAt: string | null;
  authorizedAt: string | null;
  canceledAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
};

@Injectable()
export class ProcessPaymentWebhookEventUseCase {
  constructor(
    private readonly markPaymentWebhookEventAsProcessingService: MarkPaymentWebhookEventAsProcessingService,
    private readonly markPaymentWebhookEventAsProcessedService: MarkPaymentWebhookEventAsProcessedService,
    private readonly markPaymentWebhookEventAsFailedService: MarkPaymentWebhookEventAsFailedService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,
    private readonly getAllPaymentTransactionsByCheckoutSessionIdService: GetAllPaymentTransactionsByCheckoutSessionIdService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ProcessPaymentWebhookEventDtoIn,
  ): Promise<ProcessPaymentWebhookEventDtoOut> {
    try {
      await this.markPaymentWebhookEventAsProcessingService.exec(
        new MarkPaymentWebhookEventAsProcessingDtoIn({
          _id: dtoIn.paymentWebhookEventId,
          source: 'ProcessPaymentWebhookEventUseCase.processing',
        }),
      );

      const paymentTransaction = await this.resolvePaymentTransaction(
        dtoIn.normalizedEvent,
      );

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

        const webhookDtoOut =
          await this.markPaymentWebhookEventAsProcessedService.exec(
            new MarkPaymentWebhookEventAsProcessedDtoIn({
              _id: dtoIn.paymentWebhookEventId,
              processingResult,
              source: 'ProcessPaymentWebhookEventUseCase.transactionNotFound',
            }),
          );

        return new ProcessPaymentWebhookEventDtoOut(
          webhookDtoOut.paymentWebhookEvent,
          null,
          false,
          false,
          processingResult,
        );
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

        const webhookDtoOut =
          await this.markPaymentWebhookEventAsProcessedService.exec(
            new MarkPaymentWebhookEventAsProcessedDtoIn({
              _id: dtoIn.paymentWebhookEventId,
              processingResult,
              source: 'ProcessPaymentWebhookEventUseCase.statusIgnored',
            }),
          );

        return new ProcessPaymentWebhookEventDtoOut(
          webhookDtoOut.paymentWebhookEvent,
          paymentTransaction as unknown as Record<string, unknown>,
          false,
          false,
          processingResult,
        );
      }

      const updatedTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,

            gatewayTransactionId:
              paymentTransaction.gatewayTransactionId ??
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
          }),
        );

      const splitDispatchDecision = this.resolveSplitDispatchDecision({
        event: dtoIn.normalizedEvent,
        paymentTransaction:
            updatedTransactionDtoOut.paymentTransaction as unknown as PaymentTransactionRow,
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

      const webhookDtoOut =
        await this.markPaymentWebhookEventAsProcessedService.exec(
          new MarkPaymentWebhookEventAsProcessedDtoIn({
            _id: dtoIn.paymentWebhookEventId,
            processingResult,
            source: 'ProcessPaymentWebhookEventUseCase.processed',
          }),
        );

      return new ProcessPaymentWebhookEventDtoOut(
        webhookDtoOut.paymentWebhookEvent,
        updatedTransactionDtoOut.paymentTransaction,
        true,
        splitDispatchRequired,
        processingResult,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on process payment webhook event use case';

      await this.markPaymentWebhookEventAsFailedSafe({
        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
        errorMessage: message,
        normalizedEvent: dtoIn.normalizedEvent,
      });

      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ProcessPaymentWebhookEventUseCase',
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

  private async resolvePaymentTransaction(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<PaymentTransactionRow | null> {
    if (event.paymentTransactionId !== null) {
      const found = await this.findPaymentTransactionByUniqueIdSafe(
        event.paymentTransactionId,
      );

      if (found !== null) {
        return found;
      }
    }

    const gatewayTransactionIds = [
      event.gatewayTransactionId,
      event.gatewayPaymentIntentId,
      event.gatewayChargeId,
    ].filter((value): value is string => value !== null);

    for (const gatewayTransactionId of gatewayTransactionIds) {
      const found = await this.findPaymentTransactionByGatewayTransactionIdSafe(
        gatewayTransactionId,
      );

      if (found !== null) {
        return found;
      }
    }

    if (event.checkoutSessionId !== null) {
      const transactions = await this.getPaymentTransactionsByCheckoutSessionIdSafe(
        event.checkoutSessionId,
      );

      if (transactions.length > 0) {
        return transactions[0];
      }
    }

    return null;
  }

  private async findPaymentTransactionByUniqueIdSafe(
    paymentTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(
        new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
      );

      return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
      return null;
    }
  }

  private async findPaymentTransactionByGatewayTransactionIdSafe(
    gatewayTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
          new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
          ),
        );

      return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
      return null;
    }
  }

  private async getPaymentTransactionsByCheckoutSessionIdSafe(
    checkoutSessionId: string,
    ): Promise<PaymentTransactionRow[]> {
    try {
        const dtoOut =
        await this.getAllPaymentTransactionsByCheckoutSessionIdService.exec(
            new GetAllPaymentTransactionsByCheckoutSessionIdDtoIn(
            checkoutSessionId,
            ),
        );

        const response = dtoOut as unknown as {
        paymentTransactions?: PaymentTransactionRow[];
        transactions?: PaymentTransactionRow[];
        items?: PaymentTransactionRow[];
        data?: PaymentTransactionRow[];
        };

        return (
        response.paymentTransactions ??
        response.transactions ??
        response.items ??
        response.data ??
        []
        );
    } catch {
        return [];
    }
    }

  private resolveTransactionStatusUpdate(params: {
    event: NormalizedPaymentWebhookEventDto;
    paymentTransaction: PaymentTransactionRow;
  }): TransactionStatusUpdate | null {
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

  private resolveGatewayTransactionId(
    event: NormalizedPaymentWebhookEventDto,
  ): string | null {
    return (
      event.gatewayTransactionId ??
      event.gatewayPaymentIntentId ??
      event.gatewayChargeId
    );
  }

  private buildProviderResponse(params: {
    current: Record<string, unknown> | null;
    event: NormalizedPaymentWebhookEventDto;
  }): Record<string, unknown> {
    return {
      ...(params.current ?? {}),
      latestWebhookPayload: params.event.rawPayload,
    };
  }

  private buildGatewayResponse(params: {
    current: Record<string, unknown> | null;
    event: NormalizedPaymentWebhookEventDto;
  }): Record<string, unknown> {
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

  private buildMetadata(params: {
    current: Record<string, unknown> | null;
    event: NormalizedPaymentWebhookEventDto;
  }): Record<string, unknown> {
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

  private resolveSplitDispatchDecision(params: {
    event: NormalizedPaymentWebhookEventDto;
    paymentTransaction: PaymentTransactionRow;
    }): {
    required: boolean;
    reason: string;
    sourceTransactionId: string | null;
    paymentSplitId: string | null;
    authoritativeEvent: boolean;
    } {
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

    const paymentSplitId = this.extractPaymentSplitIdFromTransactionConfig(
        params.paymentTransaction.config,
    );

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

    private resolveStripeSplitDispatchDecision(params: {
    event: NormalizedPaymentWebhookEventDto;
    paymentSplitId: string;
    }): {
    required: boolean;
    reason: string;
    sourceTransactionId: string | null;
    paymentSplitId: string | null;
    authoritativeEvent: boolean;
    } {
    if (params.event.eventType !== 'charge.succeeded') {
        return {
        required: false,
        reason:
            'stripe split dispatch is allowed only from charge.succeeded to avoid duplicate dispatch',
        sourceTransactionId: null,
        paymentSplitId: params.paymentSplitId,
        authoritativeEvent: false,
        };
    }

    const sourceTransactionId =
        params.event.gatewayChargeId ?? params.event.gatewayTransactionId;

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

    private resolveGenericSourceTransactionId(
    event: NormalizedPaymentWebhookEventDto,
    ): string | null {
    return (
        event.gatewayChargeId ??
        event.gatewayTransactionId ??
        event.gatewayPaymentIntentId ??
        event.gatewayInvoiceId
    );
    }

    private extractPaymentSplitIdFromTransactionConfig(
    config: Record<string, unknown> | null,
    ): string | null {
    if (config === null) {
        return null;
    }

    const split = config.split;

    if (!split || typeof split !== 'object' || Array.isArray(split)) {
        return null;
    }

    const paymentSplitId = (split as Record<string, unknown>).paymentSplitId;

    if (paymentSplitId === undefined || paymentSplitId === null) {
        return null;
    }

    const stringValue = String(paymentSplitId).trim();

    return stringValue === '' ? null : stringValue;
    }

  private async markPaymentWebhookEventAsFailedSafe(params: {
    paymentWebhookEventId: string;
    errorMessage: string;
    normalizedEvent: NormalizedPaymentWebhookEventDto;
  }): Promise<void> {
    try {
      await this.markPaymentWebhookEventAsFailedService.exec(
        new MarkPaymentWebhookEventAsFailedDtoIn({
          _id: params.paymentWebhookEventId,
          errorMessage: params.errorMessage,
          processingResult: {
            provider: params.normalizedEvent.provider,
            eventId: params.normalizedEvent.eventId,
            canonicalStatus: params.normalizedEvent.canonicalStatus,
            errorMessage: params.errorMessage,
          },
          source: 'ProcessPaymentWebhookEventUseCase.failed',
        }),
      );
    } catch {
      // não lança erro aqui para não ocultar o erro original do processamento
    }
  }
}
