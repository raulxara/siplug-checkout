import { Injectable } from '@nestjs/common';

import {
  PAYMENT_SPLIT_RECIPIENT_STATUS,
  PAYMENT_SPLIT_REVERSIBLE_STATUSES,
  PAYMENT_SPLIT_STATUS,
} from '../../common/constants';
import type { PaymentSplitStatus } from '../../common/constants';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { CreateStripeTransferReversalDtoIn } from '../../modules/gateway-split-transfers/stripe/services/create-stripe-transfer-reversal/dtos/create-stripe-transfer-reversal.dto-in';
import { CreateStripeTransferReversalService } from '../../modules/gateway-split-transfers/stripe/services/create-stripe-transfer-reversal/create-stripe-transfer-reversal.service';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { UpdatePaymentSplitRecipientDtoIn } from '../../modules/payment-split-recipients/services/update-payment-split-recipient/dtos/update-payment-split-recipient.dto-in';
import { UpdatePaymentSplitRecipientService } from '../../modules/payment-split-recipients/services/update-payment-split-recipient/update-payment-split-recipient.service';

import { FindPaymentSplitByUniqueIdDtoIn } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { UpdatePaymentSplitDtoIn } from '../../modules/payment-splits/services/update-payment-split/dtos/update-payment-split.dto-in';
import { UpdatePaymentSplitService } from '../../modules/payment-splits/services/update-payment-split/update-payment-split.service';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ReversePaymentSplitWithGatewayDtoIn } from './dtos/reverse-payment-split-with-gateway.dto-in';
import { ReversePaymentSplitWithGatewayDtoOut } from './dtos/reverse-payment-split-with-gateway.dto-out';

type ReversalAllocation = {
  paymentSplitRecipientId: string;
  amount: number;
};

type SupportedGatewayProvider = 'stripe' | 'mercado_pago' | 'pagseguro';

@Injectable()
export class ReversePaymentSplitWithGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitService: UpdatePaymentSplitService,

    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly updatePaymentSplitRecipientService: UpdatePaymentSplitRecipientService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,

    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly createStripeTransferReversalService: CreateStripeTransferReversalService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReversePaymentSplitWithGatewayDtoIn,
  ): Promise<ReversePaymentSplitWithGatewayDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec({
        token: this.requiredString(dtoIn.token, 'token'),
        requiredEntity: 'paymentSplit',
        requiredAction: 'reversePaymentSplitWithGateway',
      });

      const paymentSplitDtoOut =
        await this.findPaymentSplitByUniqueIdService.exec(
          new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
        );

      const paymentSplit = paymentSplitDtoOut.paymentSplit as Record<
        string,
        unknown
      >;

      const currentStatus = this.requiredString(
        paymentSplit.status,
        'paymentSplit.status',
      );

      if (currentStatus === PAYMENT_SPLIT_STATUS.REVERSED && !dtoIn.force) {
        return new ReversePaymentSplitWithGatewayDtoOut(
          false,
          PAYMENT_SPLIT_STATUS.REVERSED,
          'payment split already reversed',
          paymentSplit,
          [],
          {
            skipped: true,
            reason: 'payment split already reversed',
            paymentSplitId: dtoIn.paymentSplitId,
          },
        );
      }

      if (
        !PAYMENT_SPLIT_REVERSIBLE_STATUSES.includes(
          currentStatus as PaymentSplitStatus,
        ) &&
        !dtoIn.force
      ) {
        throw new Error(
          `payment split status does not allow reversal: ${currentStatus}`,
        );
      }

      const provider = this.normalizeSupportedGatewayProvider(
        this.requiredString(
          paymentSplit.gatewayProvider,
          'paymentSplit.gatewayProvider',
        ),
      );

      const paymentSplitAmount = Number(paymentSplit.amount ?? 0);

      if (!Number.isInteger(paymentSplitAmount) || paymentSplitAmount <= 0) {
        throw new Error('paymentSplit.amount must be greater than zero');
      }

      const reversalAmount = dtoIn.reversalAmount ?? paymentSplitAmount;

      if (reversalAmount > paymentSplitAmount) {
        throw new Error(
          'reversalAmount cannot be greater than paymentSplit.amount',
        );
      }

      const paymentTransactionId = this.requiredString(
        paymentSplit.paymentTransactionId,
        'paymentSplit.paymentTransactionId',
      );

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByUniqueIdService.exec(
          new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
        );

      const paymentTransaction =
        paymentTransactionDtoOut.paymentTransaction as Record<string, unknown>;

      const apiCredentialId = this.requiredString(
        paymentTransaction.apiCredentialId,
        'paymentTransaction.apiCredentialId',
      );

      const apiCredentialDtoOut =
        await this.findApiCredentialByUniqueIdService.exec(
          new FindApiCredentialByUniqueIdDtoIn(apiCredentialId),
        );

      const apiCredential = apiCredentialDtoOut.apiCredential as {
        provider: string;
        status: string;
        token: string | null;
        config: Record<string, unknown> | null;
      };

      if (apiCredential.status !== 'active') {
        throw new Error('api credential is not active');
      }

      const apiCredentialProvider = this.normalizeSupportedGatewayProvider(
        apiCredential.provider,
      );

      if (apiCredentialProvider !== provider) {
        throw new Error(
          'api credential provider does not match payment split provider',
        );
      }

      const recipients = await this.getPaymentSplitRecipients(dtoIn.paymentSplitId);

      if (recipients.length === 0) {
        throw new Error('payment split must have at least one recipient');
      }

      const allocations = this.allocateReversalAmount({
        recipients,
        reversalAmount,
      });

      const providerToken = this.resolveProviderToken(apiCredential);

      const gatewayRefundResult =
        provider === 'mercado_pago'
          ? await this.createMercadoPagoPaymentRefund({
              paymentTransaction,
              providerToken,
              reversalAmount,
              paymentSplitAmount,
              idempotencyKey: this.buildGatewayRefundIdempotencyKey(dtoIn),
              reason: dtoIn.reason,
            })
          : provider === 'pagseguro'
            ? await this.createPagSeguroPaymentRefund({
                paymentTransaction,
                recipients,
                allocations,
                providerToken,
                apiCredentialConfig: apiCredential.config,
                reversalAmount,
                paymentSplitAmount,
                idempotencyKey: this.buildGatewayRefundIdempotencyKey(
                  dtoIn,
                  provider,
                ),
                reason: dtoIn.reason,
              })
            : null;

      const reversedAt = new Date().toISOString();
      const recipientResults: Array<Record<string, unknown>> = [];

      for (const recipient of recipients) {
        const allocation = allocations.find(
          (item) =>
            item.paymentSplitRecipientId === String(recipient._id ?? '').trim(),
        );

        if (!allocation || allocation.amount <= 0) {
          continue;
        }

        const result = await this.reverseRecipient({
          recipient,
          paymentSplit,
          provider,
          providerToken,
          gatewayRefundResult,
          reversalAmount: allocation.amount,
          totalReversalAmount: reversalAmount,
          idempotencyKey: this.buildRecipientIdempotencyKey({
            dtoIn,
            recipient,
            amount: allocation.amount,
          }),
          reason: dtoIn.reason,
          reversedAt,
          sourceTransactionId: this.toNullableString(
            paymentTransaction.gatewayTransactionId,
          ),
        });

        recipientResults.push(result);

        await this.persistRecipientReversal({
          recipient,
          result,
          reversedAt,
        });
      }

      const summary = this.buildSummary({
        paymentSplitId: dtoIn.paymentSplitId,
        provider,
        reversedAt,
        reason: dtoIn.reason,
        reversalAmount,
        paymentSplitAmount,
        recipientResults,
        gatewayRefundResult,
      });

      const finalStatus =
        reversalAmount >= paymentSplitAmount
          ? PAYMENT_SPLIT_STATUS.REVERSED
          : PAYMENT_SPLIT_STATUS.PARTIALLY_REVERSED;

      const currentGatewayResponse =
        this.toObject(paymentSplit.gatewayResponse) ?? {};

      const previousGatewayRootStatus = this.toNullableString(
        currentGatewayResponse.status,
      );

      const updatedPaymentSplitDtoOut = await this.updatePaymentSplitService.exec(
        new UpdatePaymentSplitDtoIn({
          _id: dtoIn.paymentSplitId,

          metadata: {
            ...(this.toObject(paymentSplit.metadata) ?? {}),
            lastGatewayReversal: summary,
          },

          providerResponse: {
            ...(this.toObject(paymentSplit.providerResponse) ?? {}),
            reversal: summary,
          },

          gatewayResponse: {
            ...currentGatewayResponse,

            status: finalStatus,
            lifecycleStatus: finalStatus,

            dispatchStatus:
              this.toNullableString(currentGatewayResponse.dispatchStatus) ??
              previousGatewayRootStatus,

            reversal: summary,
          },

          status: finalStatus,

          source: 'ReversePaymentSplitWithGatewayUseCase',
        }),
      );

      const reversalSucceeded =
        summary.status === PAYMENT_SPLIT_STATUS.REVERSED ||
        summary.status === PAYMENT_SPLIT_STATUS.PARTIALLY_REVERSED;

      return new ReversePaymentSplitWithGatewayDtoOut(
        reversalSucceeded,
        finalStatus,
        reversalSucceeded
          ? 'payment split reversed with gateway successfully'
          : 'payment split reversal finished with inconsistencies',
        updatedPaymentSplitDtoOut.paymentSplit as Record<string, unknown>,
        recipientResults,
        summary,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReversePaymentSplitWithGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            paymentSplitId: dtoIn.paymentSplitId,
            reversalAmount: dtoIn.reversalAmount,
            reason: dtoIn.reason,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on reverse payment split with gateway use case';

      throw new Error(message);
    }
  }

  private async reverseRecipient(params: {
    recipient: Record<string, unknown>;
    paymentSplit: Record<string, unknown>;
    provider: SupportedGatewayProvider;
    providerToken: string;
    gatewayRefundResult: Record<string, unknown> | null;
    reversalAmount: number;
    totalReversalAmount: number;
    idempotencyKey: string;
    reason: string | null;
    reversedAt: string;
    sourceTransactionId: string | null;
  }): Promise<Record<string, unknown>> {
    const recipient = params.recipient;

    const paymentSplitRecipientId = this.requiredString(
      recipient._id,
      'paymentSplitRecipient._id',
    );

    const splitRecipientId = this.toNullableString(recipient.splitRecipientId);
    const role = this.toNullableString(recipient.role);
    const status = this.requiredString(
      recipient.status,
      'paymentSplitRecipient.status',
    );

    const recipientAmount = Number(recipient.amount ?? 0);
    const currency = this.requiredString(
      recipient.currency,
      'paymentSplitRecipient.currency',
    );

    if (this.shouldTreatAsRetainedRecipient(recipient)) {
      const finalRecipientStatus =
        params.reversalAmount >= recipientAmount
          ? PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED_REVERSED
          : PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED_PARTIALLY_REVERSED;

      return {
        paymentSplitRecipientId,
        splitRecipientId,
        role,
        type: 'retained_on_platform',
        success: true,
        status: finalRecipientStatus,
        originalStatus: status,
        reversalAmount: params.reversalAmount,
        currency,
        reversedAt: params.reversedAt,
        gatewayTransferId: null,
        gatewayReversalId: null,
        retainedOnPlatform: true,
        reason: params.reason,
      };
    }

    if (params.provider === 'mercado_pago' || params.provider === 'pagseguro') {
      return this.reverseNativeSplitRecipient({
        recipient,
        paymentSplit: params.paymentSplit,
        provider: params.provider,
        paymentSplitRecipientId,
        splitRecipientId,
        role,
        originalStatus: status,
        recipientAmount,
        currency,
        reversalAmount: params.reversalAmount,
        reason: params.reason,
        reversedAt: params.reversedAt,
        gatewayRefundResult: params.gatewayRefundResult,
        sourceTransactionId: params.sourceTransactionId,
      });
    }

    const gatewayTransferId = this.requiredString(
      recipient.gatewayTransferId,
      `paymentSplitRecipient.gatewayTransferId:${paymentSplitRecipientId}`,
    );

    const reversalDtoOut = await this.createStripeTransferReversalService.exec(
      new CreateStripeTransferReversalDtoIn({
        providerToken: params.providerToken,
        transferId: gatewayTransferId,
        amount: params.reversalAmount,
        currency,
        idempotencyKey: params.idempotencyKey,
        metadata: {
          paymentSplitId: this.requiredString(
            params.paymentSplit._id,
            'paymentSplit._id',
          ),
          paymentSplitRecipientId,
          splitRecipientId: splitRecipientId ?? '',
          role: role ?? '',
          paymentTransactionId:
            this.toNullableString(params.paymentSplit.paymentTransactionId) ??
            '',
          reversalReason: params.reason ?? '',
          source: 'ReversePaymentSplitWithGatewayUseCase',
        },
      }),
    );

    const reversal = reversalDtoOut.reversal;

    const finalRecipientStatus =
      params.reversalAmount >= recipientAmount
        ? PAYMENT_SPLIT_RECIPIENT_STATUS.REVERSED
        : PAYMENT_SPLIT_RECIPIENT_STATUS.PARTIALLY_REVERSED;

    return {
      paymentSplitRecipientId,
      splitRecipientId,
      role,
      type: 'gateway_transfer',
      success: reversalDtoOut.success,
      status: reversalDtoOut.success
        ? finalRecipientStatus
        : PAYMENT_SPLIT_RECIPIENT_STATUS.REVERSAL_FAILED,
      originalStatus: status,
      reversalAmount: params.reversalAmount,
      currency,
      reversedAt: params.reversedAt,
      gatewayTransferId,
      gatewayReversalId: this.toNullableString(reversal?.id),
      reason: params.reason,
      providerRequest: reversalDtoOut.providerRequest,
      providerResponse: reversalDtoOut.providerResponse,
      errorMessage: reversalDtoOut.errorMessage,
    };
  }

  private reverseNativeSplitRecipient(params: {
    recipient: Record<string, unknown>;
    paymentSplit: Record<string, unknown>;
    provider: 'mercado_pago' | 'pagseguro';
    paymentSplitRecipientId: string;
    splitRecipientId: string | null;
    role: string | null;
    originalStatus: string;
    recipientAmount: number;
    currency: string;
    reversalAmount: number;
    reason: string | null;
    reversedAt: string;
    gatewayRefundResult: Record<string, unknown> | null;
    sourceTransactionId: string | null;
  }): Record<string, unknown> {
    const gatewayTransferId = this.toNullableString(
      params.recipient.gatewayTransferId,
    );

    const sourceTransactionId =
      params.sourceTransactionId ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'metadata',
        'lastNativeSplitSettlement',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'providerPayload',
        'nativeSettlement',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'gatewayResponse',
        'nativeSettlement',
        'sourceTransactionId',
      ]) ??
      this.toNullableString(params.paymentSplit.gatewaySplitId);

    const finalRecipientStatus =
      params.reversalAmount >= params.recipientAmount
        ? PAYMENT_SPLIT_RECIPIENT_STATUS.REVERSED
        : PAYMENT_SPLIT_RECIPIENT_STATUS.PARTIALLY_REVERSED;

    const gatewayReversalId = this.buildNativeReversalId({
      provider: params.provider,
      sourceTransactionId,
      paymentSplitRecipientId: params.paymentSplitRecipientId,
      role: params.role,
      reversalAmount: params.reversalAmount,
    });

    return {
      paymentSplitRecipientId: params.paymentSplitRecipientId,
      splitRecipientId: params.splitRecipientId,
      role: params.role,
      type: `${params.provider}_native_split`,
      success: true,
      status: finalRecipientStatus,
      originalStatus: params.originalStatus,
      reversalAmount: params.reversalAmount,
      currency: params.currency,
      reversedAt: params.reversedAt,
      gatewayTransferId,
      gatewayReversalId,
      sourceTransactionId,
      nativeSplit: true,
      reason: params.reason,
      providerRequest: {
        provider: params.provider,
        mode: 'native_split',
        action: 'internal_native_split_reversal',
        sourceTransactionId,
        paymentSplitId: this.toNullableString(params.paymentSplit._id),
        paymentSplitRecipientId: params.paymentSplitRecipientId,
        splitRecipientId: params.splitRecipientId,
        role: params.role,
        reversalAmount: params.reversalAmount,
        currency: params.currency,
        refundResult: params.gatewayRefundResult,
        note:
          `${params.provider} native split is reversed through the payment refund mechanism; there is no separate transfer reversal call for this internal split record.`,
      },
      providerResponse: {
        provider: params.provider,
        mode: 'native_split',
        status: finalRecipientStatus,
        gatewayTransferId,
        gatewayReversalId,
        sourceTransactionId,
        reversedAt: params.reversedAt,
        refundResult: params.gatewayRefundResult,
      },
    };
  }

  private async persistRecipientReversal(params: {
    recipient: Record<string, unknown>;
    result: Record<string, unknown>;
    reversedAt: string;
  }): Promise<void> {
    const paymentSplitRecipientId = this.requiredString(
      params.recipient._id,
      'paymentSplitRecipient._id',
    );

    const resultStatus = this.requiredString(
      params.result.status,
      'recipientReversal.status',
    );

    await this.updatePaymentSplitRecipientService.exec(
      new UpdatePaymentSplitRecipientDtoIn({
        _id: paymentSplitRecipientId,

        metadata: {
          ...(this.toObject(params.recipient.metadata) ?? {}),
          lastGatewayReversal: params.result,
          lastGatewayReversedAt: params.reversedAt,
        },

        providerResponse: {
          ...(this.toObject(params.recipient.providerResponse) ?? {}),
          reversal: params.result,
        },

        gatewayResponse: {
          ...(this.toObject(params.recipient.gatewayResponse) ?? {}),
          reversal: params.result,
        },

        status: resultStatus,

        source: 'ReversePaymentSplitWithGatewayUseCase.recipient',
      }),
    );
  }

  private allocateReversalAmount(params: {
    recipients: Array<Record<string, unknown>>;
    reversalAmount: number;
  }): ReversalAllocation[] {
    const allocations: ReversalAllocation[] = [];
    let allocated = 0;

    const recipientsWithPositiveAmount = params.recipients.filter((recipient) => {
      const amount = Number(recipient.amount ?? 0);
      return Number.isInteger(amount) && amount > 0;
    });

    const liableRecipients = recipientsWithPositiveAmount.filter(
      (recipient) => this.extractBoolean(this.toObject(recipient.config), 'liableForRefund') === true,
    );

    const eligibleRecipients =
      liableRecipients.length > 0 ? liableRecipients : recipientsWithPositiveAmount;

    const allocationBaseAmount = eligibleRecipients.reduce(
      (total, recipient) => total + Number(recipient.amount ?? 0),
      0,
    );

    if (allocationBaseAmount <= 0) {
      throw new Error('payment split must have at least one eligible refund recipient');
    }

    eligibleRecipients.forEach((recipient, index) => {
      const paymentSplitRecipientId = String(recipient._id ?? '').trim();
      const recipientAmount = Number(recipient.amount ?? 0);

      const isLast = index === eligibleRecipients.length - 1;

      const amount = isLast
        ? params.reversalAmount - allocated
        : Math.floor(
            (recipientAmount * params.reversalAmount) /
              allocationBaseAmount,
          );

      allocated += amount;

      allocations.push({
        paymentSplitRecipientId,
        amount,
      });
    });

    return allocations;
  }

  private buildSummary(params: {
    paymentSplitId: string;
    provider: string;
    reversedAt: string;
    reason: string | null;
    reversalAmount: number;
    paymentSplitAmount: number;
    recipientResults: Array<Record<string, unknown>>;
    gatewayRefundResult: Record<string, unknown> | null;
  }): Record<string, unknown> {
    const successCount = params.recipientResults.filter(
      (result) => result.success === true,
    ).length;

    const failedCount = params.recipientResults.filter(
      (result) => result.success !== true,
    ).length;

    const retainedReversalCount = params.recipientResults.filter(
      (result) => result.type === 'retained_on_platform',
    ).length;

    const gatewayReversalCount = params.recipientResults.filter(
      (result) => result.type === 'gateway_transfer',
    ).length;

    const mercadoPagoNativeReversalCount = params.recipientResults.filter(
      (result) => result.type === 'mercado_pago_native_split',
    ).length;

    const pagSeguroNativeReversalCount = params.recipientResults.filter(
      (result) => result.type === 'pagseguro_native_split',
    ).length;

    const status =
      failedCount === 0
        ? params.reversalAmount >= params.paymentSplitAmount
          ? PAYMENT_SPLIT_STATUS.REVERSED
          : PAYMENT_SPLIT_STATUS.PARTIALLY_REVERSED
        : PAYMENT_SPLIT_RECIPIENT_STATUS.REVERSAL_FAILED;

    return {
      status,
      paymentSplitId: params.paymentSplitId,
      provider: params.provider,
      reversedAt: params.reversedAt,
      reason: params.reason,
      reversalAmount: params.reversalAmount,
      paymentSplitAmount: params.paymentSplitAmount,
      totalRecipients: params.recipientResults.length,
      successCount,
      failedCount,
      retainedReversalCount,
      gatewayReversalCount,
      mercadoPagoNativeReversalCount,
      pagSeguroNativeReversalCount,
      gatewayRefundResult: params.gatewayRefundResult,
      recipientResults: params.recipientResults,
    };
  }

  private buildGatewayRefundIdempotencyKey(
    dtoIn: ReversePaymentSplitWithGatewayDtoIn,
    provider: SupportedGatewayProvider = 'mercado_pago',
  ): string {
    return (
      dtoIn.idempotencyKey ??
      `${provider}-refund:${dtoIn.paymentSplitId}:${dtoIn.reversalAmount ?? 'full'}`
    );
  }

  private buildRecipientIdempotencyKey(params: {
    dtoIn: ReversePaymentSplitWithGatewayDtoIn;
    recipient: Record<string, unknown>;
    amount: number;
  }): string {
    const base =
      params.dtoIn.idempotencyKey ??
      `payment-split-reversal:${params.dtoIn.paymentSplitId}`;

    const paymentSplitRecipientId = String(params.recipient._id ?? '').trim();

    return `${base}:${paymentSplitRecipientId}:${params.amount}`;
  }

  private async createMercadoPagoPaymentRefund(params: {
    paymentTransaction: Record<string, unknown>;
    providerToken: string;
    reversalAmount: number;
    paymentSplitAmount: number;
    idempotencyKey: string;
    reason: string | null;
  }): Promise<Record<string, unknown>> {
    const paymentId = this.requiredString(
      params.paymentTransaction.gatewayTransactionId,
      'paymentTransaction.gatewayTransactionId',
    );

    const isFullRefund = params.reversalAmount >= params.paymentSplitAmount;
    const requestBody = isFullRefund
      ? {}
      : { amount: this.convertCentsToAmount(params.reversalAmount) };

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}/refunds`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.providerToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': params.idempotencyKey,
        },
        body: JSON.stringify(requestBody),
      },
    );

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    const result = {
      provider: 'mercado_pago',
      mode: 'payment_refund',
      endpoint: `/v1/payments/${paymentId}/refunds`,
      ok: response.ok,
      httpStatus: response.status,
      paymentId,
      idempotencyKey: params.idempotencyKey,
      fullRefund: isFullRefund,
      refundAmountInCents: params.reversalAmount,
      refundAmount: isFullRefund
        ? null
        : this.convertCentsToAmount(params.reversalAmount),
      reason: params.reason,
      requestBody,
      responseBody,
    };

    if (!response.ok) {
      const errorMessage =
        this.extractString(responseBody, 'message') ??
        this.extractString(responseBody, 'error') ??
        `Mercado Pago refund failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    return result;
  }

  private async createPagSeguroPaymentRefund(params: {
    paymentTransaction: Record<string, unknown>;
    recipients: Array<Record<string, unknown>>;
    allocations: ReversalAllocation[];
    providerToken: string;
    apiCredentialConfig: Record<string, unknown> | null;
    reversalAmount: number;
    paymentSplitAmount: number;
    idempotencyKey: string;
    reason: string | null;
  }): Promise<Record<string, unknown>> {
    const chargeId = this.requiredString(
      params.paymentTransaction.gatewayTransactionId,
      'paymentTransaction.gatewayTransactionId',
    );

    if (!chargeId.startsWith('CHAR_')) {
      throw new Error('PagSeguro payment transaction must contain a CHAR_ charge id');
    }

    const receivers = params.allocations.map((allocation) => {
      const recipient = params.recipients.find(
        (item) =>
          this.toNullableString(item._id) === allocation.paymentSplitRecipientId,
      );

      if (!recipient) {
        throw new Error('payment split recipient was not found for reversal');
      }

      const accountId = this.resolvePagSeguroRecipientAccountId(recipient);

      if (accountId === null) {
        throw new Error(
          `PagSeguro accountId is required for split recipient ${allocation.paymentSplitRecipientId}`,
        );
      }

      return {
        account: { id: accountId },
        amount: { value: allocation.amount },
      };
    });

    const receiverTotal = receivers.reduce(
      (total, receiver) => total + receiver.amount.value,
      0,
    );

    if (receiverTotal !== params.reversalAmount) {
      throw new Error('PagSeguro custom split reversal does not match reversalAmount');
    }

    const isFullRefund = params.reversalAmount >= params.paymentSplitAmount;
    const requestBody = {
      amount: { value: params.reversalAmount },
      splits: {
        method: 'FIXED',
        receivers,
      },
    };
    const baseUrl = this.resolvePagSeguroBaseUrl(params.apiCredentialConfig);
    const endpoint = `/charges/${chargeId}/cancel`;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.providerToken}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': params.idempotencyKey,
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);
    const result = {
      provider: 'pagseguro',
      mode: 'native_split_payment_refund',
      endpoint,
      ok: response.ok,
      httpStatus: response.status,
      chargeId,
      idempotencyKey: params.idempotencyKey,
      fullRefund: isFullRefund,
      refundAmountInCents: params.reversalAmount,
      reason: params.reason,
      requestBody,
      responseBody,
    };

    if (!response.ok) {
      const errorMessage =
        this.extractString(responseBody, 'message') ??
        this.extractString(responseBody, 'error') ??
        `PagSeguro refund failed with status ${response.status}`;

      throw new Error(errorMessage);
    }

    return result;
  }

  private resolvePagSeguroBaseUrl(
    apiCredentialConfig: Record<string, unknown> | null,
  ): string {
    const configuredBaseUrl = this.toNullableString(
      apiCredentialConfig?.baseUrl,
    );
    const baseUrl = configuredBaseUrl ?? 'https://api.pagseguro.com';

    return baseUrl.replace(/\/+$/, '');
  }

  private resolvePagSeguroRecipientAccountId(
    recipient: Record<string, unknown>,
  ): string | null {
    const directAccountId = this.toNullableString(
      recipient.gatewayRecipientId,
    );

    if (directAccountId?.startsWith('ACCO_')) {
      return directAccountId;
    }

    const config = this.toObject(recipient.config);
    const pagSeguroAccountId = this.toNullableString(
      config?.pagseguroAccountId,
    );

    if (pagSeguroAccountId?.startsWith('ACCO_')) {
      return pagSeguroAccountId;
    }

    const gatewayAccounts = this.toObject(config?.gatewayAccounts);
    const pagSeguroAccount = this.toObject(gatewayAccounts?.pagseguro);
    const accountId = this.toNullableString(pagSeguroAccount?.accountId);

    return accountId?.startsWith('ACCO_') ? accountId : null;
  }

  private async getPaymentSplitRecipients(
    paymentSplitId: string,
  ): Promise<Array<Record<string, unknown>>> {
    const recipientsDtoOut =
      await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
        new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(paymentSplitId),
      );

    return this.extractRecipients(recipientsDtoOut);
  }

  private convertCentsToAmount(valueInCents: number): number {
    return Math.round(valueInCents) / 100;
  }

  private parseJson(value: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(value);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private extractString(
    object: Record<string, unknown> | null,
    key: string,
  ): string | null {
    if (object === null) {
      return null;
    }

    return this.toNullableString(object[key]);
  }

  private resolveProviderToken(apiCredential: {
    token: string | null;
  }): string {
    if (!apiCredential.token) {
      throw new Error('api credential token is required');
    }

    const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: {
            token: apiCredential.token,
          },
        },
        keysToDecrypt: ['token'],
        strict: true,
      }),
    );

    const config = decryptedDtoOut.apiCredential.config;

    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('decrypted api credential token config is invalid');
    }

    const token = String((config as Record<string, unknown>).token ?? '').trim();

    if (token === '') {
      throw new Error('decrypted api credential token is required');
    }

    return token;
  }

  private extractRecipients(
    dtoOut: unknown,
  ): Array<Record<string, unknown>> {
    const response = dtoOut as {
      paymentSplitRecipients?: Array<Record<string, unknown>>;
      recipients?: Array<Record<string, unknown>>;
      items?: Array<Record<string, unknown>>;
      data?: Array<Record<string, unknown>>;
    };

    return (
      response.paymentSplitRecipients ??
      response.recipients ??
      response.items ??
      response.data ??
      []
    );
  }

  private shouldTreatAsRetainedRecipient(
    recipient: Record<string, unknown>,
  ): boolean {
    const status = String(recipient.status ?? '').trim();
    const config = this.toObject(recipient.config);
    const metadata = this.toObject(recipient.metadata);

    if (
      status === PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED ||
      status === PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED_REVERSED ||
      status === PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED_PARTIALLY_REVERSED
    ) {
      return true;
    }

    return (
      this.extractBoolean(config, 'retainOnPlatform') ??
      this.extractBoolean(config, 'retain_on_platform') ??
      this.extractBoolean(metadata, 'retainOnPlatform') ??
      this.extractBoolean(metadata, 'retain_on_platform') ??
      false
    );
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

  private normalizeSupportedGatewayProvider(
    provider: string,
  ): SupportedGatewayProvider {
    const normalized = provider.trim().toLowerCase();

    if (['stripe'].includes(normalized)) {
      return 'stripe';
    }

    if (['mercado_pago', 'mercadopago', 'mercado-pago'].includes(normalized)) {
      return 'mercado_pago';
    }

    if (['pagseguro', 'pagbank', 'pag-bank', 'pag_seguro'].includes(normalized)) {
      return 'pagseguro';
    }

    throw new Error(`gateway reversal not implemented for: ${provider}`);
  }

  private buildNativeReversalId(params: {
    provider: 'mercado_pago' | 'pagseguro';
    sourceTransactionId: string | null;
    paymentSplitRecipientId: string;
    role: string | null;
    reversalAmount: number;
  }): string {
    return [
      `${params.provider}-native-reversal`,
      params.sourceTransactionId ?? 'unknown-payment',
      params.role ?? 'recipient',
      params.paymentSplitRecipientId,
      String(params.reversalAmount),
    ].join(':');
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

  private extractBoolean(
    object: Record<string, unknown> | null,
    key: string,
  ): boolean | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (value === true || value === false) {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();

      if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
        return true;
      }

      if (normalized === 'false' || normalized === '0' || normalized === 'no') {
        return false;
      }
    }

    if (typeof value === 'number') {
      if (value === 1) {
        return true;
      }

      if (value === 0) {
        return false;
      }
    }

    return null;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = String(value).trim();

    return normalized === '' ? null : normalized;
  }
}
