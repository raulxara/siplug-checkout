import { Injectable } from '@nestjs/common';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindPaymentSplitByUniqueIdDtoIn } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';

import { DispatchPaymentSplitToGatewayDtoIn } from '../dispatch-payment-split-to-gateway/dtos/dispatch-payment-split-to-gateway.dto-in';
import { DispatchPaymentSplitToGatewayUseCase } from '../dispatch-payment-split-to-gateway/dispatch-payment-split-to-gateway.use-case';
import { ReconcilePaymentSplitWithGatewayDtoIn } from '../reconcile-payment-split-with-gateway/dtos/reconcile-payment-split-with-gateway.dto-in';
import { ReconcilePaymentSplitWithGatewayUseCase } from '../reconcile-payment-split-with-gateway/reconcile-payment-split-with-gateway.use-case';

import { RetryPaymentSplitDispatchDtoIn } from './dtos/retry-payment-split-dispatch.dto-in';
import { RetryPaymentSplitDispatchDtoOut } from './dtos/retry-payment-split-dispatch.dto-out';

@Injectable()
export class RetryPaymentSplitDispatchUseCase {
  constructor(
    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly dispatchPaymentSplitToGatewayUseCase: DispatchPaymentSplitToGatewayUseCase,
    private readonly reconcilePaymentSplitWithGatewayUseCase: ReconcilePaymentSplitWithGatewayUseCase,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RetryPaymentSplitDispatchDtoIn,
  ): Promise<RetryPaymentSplitDispatchDtoOut> {
    try {
      const paymentSplitDtoOut =
        await this.findPaymentSplitByUniqueIdService.exec(
          new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
        );

      const paymentSplit = paymentSplitDtoOut.paymentSplit as Record<
        string,
        unknown
      >;

      const currentStatus = String(paymentSplit.status ?? '').trim();

      const provider = this.requiredString(
        paymentSplit.gatewayProvider,
        'paymentSplit.gatewayProvider',
      );

      if (this.isPagSeguroProvider(provider)) {
        return this.retryPagSeguroNativeSplit({ dtoIn, paymentSplit });
      }

      if (currentStatus === 'transferred') {
        return new RetryPaymentSplitDispatchDtoOut(
          false,
          'payment split already transferred',
          paymentSplit,
          [],
          {
            skipped: true,
            reason: 'payment split already transferred',
          },
        );
      }

      const retryableStatuses = [
        'created',
        'pending_gateway',
        'processing_gateway',
        'failed',
        'partially_transferred',
        'gateway_failed_retryable',
      ];

      if (!retryableStatuses.includes(currentStatus)) {
        return new RetryPaymentSplitDispatchDtoOut(
          false,
          `payment split status does not allow retry: ${currentStatus}`,
          paymentSplit,
          [],
          {
            skipped: true,
            reason: 'payment split status does not allow retry',
            currentStatus,
            retryableStatuses,
          },
        );
      }

      const paymentTransactionId = this.requiredString(
        paymentSplit.paymentTransactionId,
        'paymentSplit.paymentTransactionId',
      );

      const sourceTransactionId =
        dtoIn.sourceTransactionId ??
        this.extractSourceTransactionIdFromSplit(paymentSplit);

      if (!sourceTransactionId) {
        throw new Error(
          'sourceTransactionId is required to retry payment split dispatch',
        );
      }

      const dispatchDtoOut =
        await this.dispatchPaymentSplitToGatewayUseCase.exec(
          new DispatchPaymentSplitToGatewayDtoIn({
            paymentSplitId: dtoIn.paymentSplitId,
            sourceTransactionId,
            paymentTransactionId,
            paymentWebhookEventId: this.extractNullableStringFromPath(
              paymentSplit,
              ['metadata', 'lastGatewayDispatch', 'paymentWebhookEventId'],
            ),
            provider,
            eventId:
              this.extractNullableStringFromPath(paymentSplit, [
                'metadata',
                'lastGatewayDispatch',
                'eventId',
              ]) ?? 'manual-retry',
            eventType:
              this.extractNullableStringFromPath(paymentSplit, [
                'metadata',
                'lastGatewayDispatch',
                'eventType',
              ]) ?? 'manual.retry',
            eventAction:
              this.extractNullableStringFromPath(paymentSplit, [
                'metadata',
                'lastGatewayDispatch',
                'eventAction',
              ]) ?? 'manual.retry',
            canonicalStatus:
              this.extractNullableStringFromPath(paymentSplit, [
                'metadata',
                'lastGatewayDispatch',
                'canonicalStatus',
              ]) ?? 'paid',
          }),
        );

      const dispatchResult = dispatchDtoOut as unknown as Record<
        string,
        unknown
      >;

      const dispatched = Boolean(dispatchResult.dispatched);

      const message =
        this.toNullableString(dispatchResult.message) ??
        this.toNullableString(dispatchResult.reason) ??
        this.toNullableString(dispatchResult.errorMessage) ??
        (dispatched
          ? 'payment split dispatched to gateway successfully'
          : 'payment split was not dispatched');

      const updatedPaymentSplit =
        this.toObject(dispatchResult.paymentSplit) ?? paymentSplit;

      const recipients = this.extractDispatchRecipients(dispatchResult);

      const gatewayResult =
        this.toObject(dispatchResult.gatewayResult) ??
        this.toObject(dispatchResult.result) ??
        null;

      return new RetryPaymentSplitDispatchDtoOut(
        dispatched,
        message,
        updatedPaymentSplit,
        recipients,
        gatewayResult,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RetryPaymentSplitDispatchUseCase',
          error,
          appFile: __filename,
          context: {
            paymentSplitId: dtoIn.paymentSplitId,
            sourceTransactionId: dtoIn.sourceTransactionId,
            reason: dtoIn.reason,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on retry payment split dispatch use case';

      throw new Error(message);
    }
  }

  private async retryPagSeguroNativeSplit(params: {
    dtoIn: RetryPaymentSplitDispatchDtoIn;
    paymentSplit: Record<string, unknown>;
  }): Promise<RetryPaymentSplitDispatchDtoOut> {
    const reconciliationDtoOut =
      await this.reconcilePaymentSplitWithGatewayUseCase.exec(
        new ReconcilePaymentSplitWithGatewayDtoIn({
          token: params.dtoIn.token,
          paymentSplitId: params.dtoIn.paymentSplitId,
          persistResult: true,
          reason:
            params.dtoIn.reason ??
            'safe native split retry: reconciliation before any gateway action',
        }),
      );

    return new RetryPaymentSplitDispatchDtoOut(
      reconciliationDtoOut.reconciled,
      reconciliationDtoOut.reconciled
        ? 'PagSeguro native split retry completed through reconciliation; no transfer was replayed'
        : 'PagSeguro native split retry stopped because reconciliation found inconsistencies; no transfer was replayed',
      reconciliationDtoOut.paymentSplit,
      reconciliationDtoOut.recipientResults,
      {
        provider: 'pagseguro',
        mode: 'native_split_safe_retry',
        replayedGatewayOperation: false,
        reconciliation: reconciliationDtoOut.summary,
      },
    );
  }

  private isPagSeguroProvider(provider: string): boolean {
    return ['pagseguro', 'pagbank', 'pag-bank', 'pag_seguro'].includes(
      provider.trim().toLowerCase(),
    );
  }

  private extractSourceTransactionIdFromSplit(
    paymentSplit: Record<string, unknown>,
  ): string | null {
    return (
      this.extractNullableStringFromPath(paymentSplit, [
        'providerPayload',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(paymentSplit, [
        'gatewayResponse',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(paymentSplit, [
        'metadata',
        'lastGatewayDispatch',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(paymentSplit, [
        'metadata',
        'lastDispatchReservation',
        'sourceTransactionId',
      ])
    );
  }

  private extractDispatchRecipients(
    dispatchResult: Record<string, unknown>,
  ): Array<Record<string, unknown>> {
    const candidates = [
      dispatchResult.recipients,
      dispatchResult.paymentSplitRecipients,
      dispatchResult.updatedRecipients,
      dispatchResult.items,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate.filter(
          (item): item is Record<string, unknown> =>
            !!item && typeof item === 'object' && !Array.isArray(item),
        );
      }
    }

    return [];
  }

  private extractNullableStringFromPath(
    object: Record<string, unknown>,
    path: string[],
  ): string | null {
    let current: unknown = object;

    for (const key of path) {
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return null;
      }

      current = (current as Record<string, unknown>)[key];
    }

    return this.toNullableString(current);
  }

  private requiredString(value: unknown, field: string): string {
    const normalized = this.toNullableString(value);

    if (normalized === null) {
      throw new Error(`${field} is required`);
    }

    return normalized;
  }

  private toObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = String(value).trim();

    return normalized === '' ? null : normalized;
  }
}
