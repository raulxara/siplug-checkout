import { Injectable } from '@nestjs/common';

import {
  PAYMENT_SPLIT_RECIPIENT_STATUS,
  PAYMENT_SPLIT_REVERSIBLE_STATUSES,
  PAYMENT_SPLIT_STATUS,
  assertGatewaySupportsTransferReversal,
} from '../../common/constants';
import type {
  PaymentSplitRecipientStatus,
  PaymentSplitStatus,
} from '../../common/constants';

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

      const provider = this.requiredString(
        paymentSplit.gatewayProvider,
        'paymentSplit.gatewayProvider',
      );

      assertGatewaySupportsTransferReversal(provider);

      if (provider !== 'stripe') {
        throw new Error(`gateway reversal not implemented for: ${provider}`);
      }

      const paymentSplitAmount = Number(paymentSplit.amount ?? 0);

      if (!Number.isInteger(paymentSplitAmount) || paymentSplitAmount <= 0) {
        throw new Error('paymentSplit.amount must be greater than zero');
      }

      const reversalAmount = dtoIn.reversalAmount ?? paymentSplitAmount;

      if (reversalAmount > paymentSplitAmount) {
        throw new Error('reversalAmount cannot be greater than paymentSplit.amount');
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
      };

      if (apiCredential.status !== 'active') {
        throw new Error('api credential is not active');
      }

      if (apiCredential.provider !== provider) {
        throw new Error('api credential provider does not match payment split provider');
      }

      const providerToken = this.resolveProviderToken(apiCredential);

      const recipientsDtoOut =
        await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
          new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
            dtoIn.paymentSplitId,
          ),
        );

      const recipients = this.extractRecipients(recipientsDtoOut);

      if (recipients.length === 0) {
        throw new Error('payment split must have at least one recipient');
      }

      const allocations = this.allocateReversalAmount({
        recipients,
        paymentSplitAmount,
        reversalAmount,
      });

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
          providerToken,
          reversalAmount: allocation.amount,
          totalReversalAmount: reversalAmount,
          idempotencyKey: this.buildRecipientIdempotencyKey({
            dtoIn,
            recipient,
            amount: allocation.amount,
          }),
          reason: dtoIn.reason,
          reversedAt,
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

      const reversed = summary.status === PAYMENT_SPLIT_STATUS.REVERSED;

      return new ReversePaymentSplitWithGatewayDtoOut(
        reversed,
        finalStatus,
        reversed
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
    providerToken: string;
    reversalAmount: number;
    totalReversalAmount: number;
    idempotencyKey: string;
    reason: string | null;
    reversedAt: string;
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
    paymentSplitAmount: number;
    reversalAmount: number;
  }): ReversalAllocation[] {
    const allocations: ReversalAllocation[] = [];
    let allocated = 0;

    const eligibleRecipients = params.recipients.filter((recipient) => {
      const amount = Number(recipient.amount ?? 0);
      return Number.isInteger(amount) && amount > 0;
    });

    eligibleRecipients.forEach((recipient, index) => {
      const paymentSplitRecipientId = String(recipient._id ?? '').trim();
      const recipientAmount = Number(recipient.amount ?? 0);

      const isLast = index === eligibleRecipients.length - 1;

      const amount = isLast
        ? params.reversalAmount - allocated
        : Math.floor(
            (recipientAmount * params.reversalAmount) /
              params.paymentSplitAmount,
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

    const status = failedCount === 0
      ? PAYMENT_SPLIT_STATUS.REVERSED
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
      recipientResults: params.recipientResults,
    };
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