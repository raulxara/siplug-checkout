import { Injectable } from '@nestjs/common';

import {
  PAYMENT_SPLIT_RECIPIENT_STATUS,
} from '../../common/constants';
import type { PaymentSplitRecipientStatus } from '../../common/constants';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { RetrieveStripeTransferDtoIn } from '../../modules/gateway-split-transfers/stripe/services/retrieve-stripe-transfer/dtos/retrieve-stripe-transfer.dto-in';
import { RetrieveStripeTransferService } from '../../modules/gateway-split-transfers/stripe/services/retrieve-stripe-transfer/retrieve-stripe-transfer.service';

import { GetMercadoPagoPaymentDtoIn } from '../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/dtos/get-mercado-pago-payment.dto-in';
import { GetMercadoPagoPaymentService } from '../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service';

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

import { ReconcilePaymentSplitWithGatewayDtoIn } from './dtos/reconcile-payment-split-with-gateway.dto-in';
import { ReconcilePaymentSplitWithGatewayDtoOut } from './dtos/reconcile-payment-split-with-gateway.dto-out';

type NormalizedGatewayProvider = 'stripe' | 'mercado_pago';

type MercadoPagoPaymentReconciliationResult = {
  updatedPaymentSplit: Record<string, unknown>;
  recipientResults: Array<Record<string, unknown>>;
  paymentResult: Record<string, unknown>;
  settlementResult: Record<string, unknown> | null;
  gatewayPayment: Record<string, unknown>;
};

@Injectable()
export class ReconcilePaymentSplitWithGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitService: UpdatePaymentSplitService,

    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly updatePaymentSplitRecipientService: UpdatePaymentSplitRecipientService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,

    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly retrieveStripeTransferService: RetrieveStripeTransferService,
    private readonly getMercadoPagoPaymentService: GetMercadoPagoPaymentService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReconcilePaymentSplitWithGatewayDtoIn,
  ): Promise<ReconcilePaymentSplitWithGatewayDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec({
        token: this.requiredString(dtoIn.token, 'token'),
        requiredEntity: 'paymentSplit',
        requiredAction: 'reconcilePaymentSplitWithGateway',
      });

      const paymentSplitDtoOut =
        await this.findPaymentSplitByUniqueIdService.exec(
          new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
        );

      const paymentSplit = paymentSplitDtoOut.paymentSplit as Record<
        string,
        unknown
      >;

      const provider = this.normalizeGatewayProvider(
        this.requiredString(paymentSplit.gatewayProvider, 'paymentSplit.gatewayProvider'),
      );

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

      const credentialProvider = this.normalizeGatewayProvider(
        this.requiredString(apiCredential.provider, 'apiCredential.provider'),
      );

      if (credentialProvider !== provider) {
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

      const checkedAt = new Date().toISOString();

      if (provider === 'mercado_pago') {
        const mercadoPagoResult = await this.reconcileMercadoPagoNativeSplit({
          dtoIn,
          paymentSplit,
          paymentTransaction,
          providerToken,
          recipients,
          checkedAt,
        });

        const summary = this.buildSummary({
          paymentSplitId: dtoIn.paymentSplitId,
          provider,
          checkedAt,
          reason: dtoIn.reason,
          recipientResults: mercadoPagoResult.recipientResults,
          paymentResult: mercadoPagoResult.paymentResult,
          settlementResult: mercadoPagoResult.settlementResult,
        });

        const reconciled = summary.status === 'reconciled';

        let updatedPaymentSplit = mercadoPagoResult.updatedPaymentSplit;

        if (dtoIn.persistResult) {
          const updatedDtoOut = await this.updatePaymentSplitService.exec(
            new UpdatePaymentSplitDtoIn({
              _id: dtoIn.paymentSplitId,

              metadata: {
                ...(this.toObject(updatedPaymentSplit.metadata) ?? {}),
                lastGatewayReconciliation: summary,
              },

              providerResponse: {
                ...(this.toObject(updatedPaymentSplit.providerResponse) ?? {}),
                reconciliation: summary,
              },

              gatewayResponse: {
                ...(this.toObject(updatedPaymentSplit.gatewayResponse) ?? {}),
                reconciliation: summary,
              },

              source: 'ReconcilePaymentSplitWithGatewayUseCase',
            }),
          );

          updatedPaymentSplit = updatedDtoOut.paymentSplit as Record<
            string,
            unknown
          >;
        }

        return new ReconcilePaymentSplitWithGatewayDtoOut(
          reconciled,
          String(summary.status),
          reconciled
            ? 'payment split reconciled with gateway successfully'
            : 'payment split reconciliation found inconsistencies',
          updatedPaymentSplit,
          mercadoPagoResult.recipientResults,
          summary,
        );
      }

      const sourceTransactionId =
        this.extractNullableStringFromPath(paymentSplit, [
          'providerPayload',
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
        ]);

      const recipientResults: Array<Record<string, unknown>> = [];

      for (const recipient of recipients) {
        const result = await this.reconcileStripeRecipient({
          recipient,
          paymentSplit,
          providerToken,
          sourceTransactionId,
          checkedAt,
        });

        recipientResults.push(result);

        if (dtoIn.persistResult) {
          await this.persistRecipientReconciliation({
            recipient,
            result,
            checkedAt,
          });
        }
      }

      const summary = this.buildSummary({
        paymentSplitId: dtoIn.paymentSplitId,
        provider,
        checkedAt,
        reason: dtoIn.reason,
        recipientResults,
      });

      const reconciled = summary.status === 'reconciled';

      let updatedPaymentSplit = paymentSplit;

      if (dtoIn.persistResult) {
        const updatedDtoOut = await this.updatePaymentSplitService.exec(
          new UpdatePaymentSplitDtoIn({
            _id: dtoIn.paymentSplitId,

            metadata: {
              ...(this.toObject(paymentSplit.metadata) ?? {}),
              lastGatewayReconciliation: summary,
            },

            providerResponse: {
              ...(this.toObject(paymentSplit.providerResponse) ?? {}),
              reconciliation: summary,
            },

            gatewayResponse: {
              ...(this.toObject(paymentSplit.gatewayResponse) ?? {}),
              reconciliation: summary,
            },

            source: 'ReconcilePaymentSplitWithGatewayUseCase',
          }),
        );

        updatedPaymentSplit = updatedDtoOut.paymentSplit as Record<
          string,
          unknown
        >;
      }

      return new ReconcilePaymentSplitWithGatewayDtoOut(
        reconciled,
        String(summary.status),
        reconciled
          ? 'payment split reconciled with gateway successfully'
          : 'payment split reconciliation found inconsistencies',
        updatedPaymentSplit,
        recipientResults,
        summary,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReconcilePaymentSplitWithGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            paymentSplitId: dtoIn.paymentSplitId,
            persistResult: dtoIn.persistResult,
            reason: dtoIn.reason,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on reconcile payment split with gateway use case';

      throw new Error(message);
    }
  }

  private async reconcileMercadoPagoNativeSplit(params: {
    dtoIn: ReconcilePaymentSplitWithGatewayDtoIn;
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
    providerToken: string;
    recipients: Array<Record<string, unknown>>;
    checkedAt: string;
  }): Promise<MercadoPagoPaymentReconciliationResult> {
    const sourceTransactionId = this.requiredString(
      this.resolveMercadoPagoSourceTransactionId({
        paymentSplit: params.paymentSplit,
        paymentTransaction: params.paymentTransaction,
      }),
      'mercadoPago.sourceTransactionId',
    );

    const mercadoPagoDtoOut = await this.getMercadoPagoPaymentService.exec(
      new GetMercadoPagoPaymentDtoIn({
        paymentId: sourceTransactionId,
        accessToken: params.providerToken,
      }),
    );

    const gatewayPayment = mercadoPagoDtoOut.payment;
    const canonicalStatus = this.normalizeMercadoPagoPaymentStatus(gatewayPayment);
    const paidLike = canonicalStatus === 'paid';

    let updatedPaymentSplit = params.paymentSplit;
    let effectiveRecipients = params.recipients;
    let settlementResult: Record<string, unknown> | null = null;

    const splitStatus = this.requiredString(
      params.paymentSplit.status,
      'paymentSplit.status',
    );

    if (
      paidLike &&
      splitStatus !== 'transferred' &&
      splitStatus !== 'partially_transferred' &&
      params.dtoIn.persistResult
    ) {
      const settlement = await this.markMercadoPagoNativeSplitAsTransferred({
        paymentSplit: params.paymentSplit,
        paymentTransaction: params.paymentTransaction,
        gatewayPayment,
        recipients: params.recipients,
        sourceTransactionId,
        checkedAt: params.checkedAt,
      });

      updatedPaymentSplit = settlement.paymentSplit;
      effectiveRecipients = settlement.paymentSplitRecipients;
      settlementResult = settlement.summary;
    }

    const paymentResult = this.buildMercadoPagoPaymentResult({
      paymentSplit: updatedPaymentSplit,
      paymentTransaction: params.paymentTransaction,
      gatewayPayment,
      recipients: effectiveRecipients,
      sourceTransactionId,
      canonicalStatus,
      checkedAt: params.checkedAt,
      settlementResult,
    });

    const recipientResults = effectiveRecipients.map((recipient) =>
      this.reconcileMercadoPagoNativeRecipient({
        recipient,
        gatewayPayment,
        sourceTransactionId,
        canonicalStatus,
        checkedAt: params.checkedAt,
      }),
    );

    if (params.dtoIn.persistResult) {
      for (const recipient of effectiveRecipients) {
        const result = recipientResults.find(
          (item) =>
            this.toNullableString(item.paymentSplitRecipientId) ===
            this.toNullableString(recipient._id),
        );

        if (result) {
          await this.persistRecipientReconciliation({
            recipient,
            result,
            checkedAt: params.checkedAt,
          });
        }
      }
    }

    return {
      updatedPaymentSplit,
      recipientResults,
      paymentResult,
      settlementResult,
      gatewayPayment,
    };
  }

  private async markMercadoPagoNativeSplitAsTransferred(params: {
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
    gatewayPayment: Record<string, unknown>;
    recipients: Array<Record<string, unknown>>;
    sourceTransactionId: string;
    checkedAt: string;
  }): Promise<{
    paymentSplit: Record<string, unknown>;
    paymentSplitRecipients: Array<Record<string, unknown>>;
    summary: Record<string, unknown>;
  }> {
    const paymentSplitId = this.requiredString(
      params.paymentSplit._id,
      'paymentSplit._id',
    );

    const paymentTransactionId = this.requiredString(
      params.paymentTransaction._id,
      'paymentTransaction._id',
    );

    const marketplaceFeeAmount = this.resolveMercadoPagoApplicationFeeAmount(
      params.gatewayPayment,
    );

    const settlementSummary = {
      mode: 'native_split',
      reason: 'native split was already executed by the payment gateway fee mechanism',
      status: 'transferred',
      provider: 'mercado_pago',
      eventType: 'payment',
      eventAction: 'manual.reconcile',
      canonicalStatus: 'paid',
      settledAt: params.checkedAt,
      sourceTransactionId: params.sourceTransactionId,
      gatewayTransactionId: params.sourceTransactionId,
      paymentSplitId,
      paymentTransactionId,
      collectorId: this.toNullableString(params.gatewayPayment.collector_id),
      marketplaceOwner: this.toNullableString(params.gatewayPayment.marketplace_owner),
      marketplaceFeeAmount,
    };

    const updatedRecipients: Array<Record<string, unknown>> = [];

    for (const recipient of params.recipients) {
      const recipientId = this.requiredString(
        recipient._id,
        'paymentSplitRecipient._id',
      );

      const role = this.toNullableString(recipient.role) ?? 'recipient';

      const recipientSettlement = {
        mode: 'native_split',
        role,
        status: 'transferred',
        provider: 'mercado_pago',
        settledAt: params.checkedAt,
        description:
          role === 'platform'
            ? 'marketplace fee collected by native split'
            : 'recipient settled by native split',
        gatewayTransferId: `mercado-pago-native:${params.sourceTransactionId}:${role}:${recipientId}`,
      };

      const updatedRecipientData = {
        ...(recipient as Record<string, unknown>),
        status: 'transferred',
        gatewayTransferId: String(recipientSettlement.gatewayTransferId),
        metadata: {
          ...(this.toObject(recipient.metadata) ?? {}),
          lastNativeSplitSettlement: recipientSettlement,
        },
        providerResponse: {
          ...(this.toObject(recipient.providerResponse) ?? {}),
          nativeSettlement: recipientSettlement,
        },
        gatewayResponse: {
          ...(this.toObject(recipient.gatewayResponse) ?? {}),
          nativeSettlement: recipientSettlement,
        },
      };

      await this.updatePaymentSplitRecipientService.exec(
        new UpdatePaymentSplitRecipientDtoIn({
          _id: recipientId,
          status: 'transferred' as PaymentSplitRecipientStatus,
          gatewayTransferId: String(recipientSettlement.gatewayTransferId),
          metadata: {
            ...(this.toObject(recipient.metadata) ?? {}),
            lastNativeSplitSettlement: recipientSettlement,
          },
          providerResponse: {
            ...(this.toObject(recipient.providerResponse) ?? {}),
            nativeSettlement: recipientSettlement,
          },
          gatewayResponse: {
            ...(this.toObject(recipient.gatewayResponse) ?? {}),
            nativeSettlement: recipientSettlement,
          },
          source:
            'ReconcilePaymentSplitWithGatewayUseCase.markMercadoPagoNativeRecipientAsTransferred',
        }),
      );

      updatedRecipients.push(updatedRecipientData);
    }

    const updatedPaymentSplitDtoOut = await this.updatePaymentSplitService.exec(
      new UpdatePaymentSplitDtoIn({
        _id: paymentSplitId,
        status: 'transferred',
        gatewaySplitId: params.sourceTransactionId,
        metadata: {
          ...(this.toObject(params.paymentSplit.metadata) ?? {}),
          lastNativeSplitSettlement: settlementSummary,
        },
        providerPayload: {
          ...(this.toObject(params.paymentSplit.providerPayload) ?? {}),
          nativeSettlement: settlementSummary,
        },
        providerResponse: {
          ...(this.toObject(params.paymentSplit.providerResponse) ?? {}),
          nativeSettlement: settlementSummary,
        },
        gatewayResponse: {
          ...(this.toObject(params.paymentSplit.gatewayResponse) ?? {}),
          nativeSettlement: settlementSummary,
        },
        source: 'ReconcilePaymentSplitWithGatewayUseCase.nativeSettlement',
      }),
    );

    return {
      paymentSplit: updatedPaymentSplitDtoOut.paymentSplit as Record<string, unknown>,
      paymentSplitRecipients: updatedRecipients,
      summary: settlementSummary,
    };
  }

  private buildMercadoPagoPaymentResult(params: {
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
    gatewayPayment: Record<string, unknown>;
    recipients: Array<Record<string, unknown>>;
    sourceTransactionId: string;
    canonicalStatus: string;
    checkedAt: string;
    settlementResult: Record<string, unknown> | null;
  }): Record<string, unknown> {
    const expectedAmountInCents = Number(params.paymentTransaction.amount ?? 0);
    const actualAmountInCents = this.convertMercadoPagoAmountToCents(
      params.gatewayPayment.transaction_amount,
    );

    const expectedCurrency = this.requiredString(
      params.paymentTransaction.currency,
      'paymentTransaction.currency',
    ).toUpperCase();

    const actualCurrency = this.requiredString(
      params.gatewayPayment.currency_id,
      'gatewayPayment.currency_id',
    ).toUpperCase();

    const expectedExternalReference = this.toNullableString(
      params.paymentTransaction.externalReference,
    );

    const actualExternalReference = this.toNullableString(
      params.gatewayPayment.external_reference,
    );

    const expectedApplicationFeeInCents =
      this.resolveExpectedMercadoPagoApplicationFeeInCents(params.recipients);

    const actualApplicationFeeInCents = this.convertMercadoPagoAmountToCents(
      this.resolveMercadoPagoApplicationFeeAmount(params.gatewayPayment),
    );

    const paymentIsPaid = params.canonicalStatus === 'paid';
    const splitStatus = this.requiredString(params.paymentSplit.status, 'paymentSplit.status');

    const checks = {
      sourceTransactionMatched:
        this.toNullableString(params.gatewayPayment.id) === params.sourceTransactionId,
      amountMatched: actualAmountInCents === expectedAmountInCents,
      currencyMatched: actualCurrency === expectedCurrency,
      externalReferenceMatched:
        expectedExternalReference === null ||
        actualExternalReference === expectedExternalReference,
      applicationFeeMatched:
        !paymentIsPaid ||
        expectedApplicationFeeInCents === null ||
        actualApplicationFeeInCents === expectedApplicationFeeInCents,
      splitStatusMatched: paymentIsPaid
        ? splitStatus === 'transferred' || splitStatus === 'partially_transferred'
        : splitStatus !== 'transferred',
    };

    const matched = Object.values(checks).every((value) => value === true);

    return {
      type: 'mercado_pago_payment',
      status: matched ? 'matched' : 'mismatch',
      matched,
      checkedAt: params.checkedAt,
      sourceTransactionId: params.sourceTransactionId,
      canonicalStatus: params.canonicalStatus,
      gatewayStatus: this.toNullableString(params.gatewayPayment.status),
      gatewayStatusDetail: this.toNullableString(params.gatewayPayment.status_detail),
      expected: {
        amountInCents: expectedAmountInCents,
        currency: expectedCurrency,
        externalReference: expectedExternalReference,
        applicationFeeInCents: expectedApplicationFeeInCents,
        splitStatus: paymentIsPaid ? 'transferred' : 'not_transferred',
      },
      actual: {
        paymentId: this.toNullableString(params.gatewayPayment.id),
        amountInCents: actualAmountInCents,
        currency: actualCurrency,
        externalReference: actualExternalReference,
        applicationFeeInCents: actualApplicationFeeInCents,
        collectorId: this.toNullableString(params.gatewayPayment.collector_id),
        marketplaceOwner: this.toNullableString(params.gatewayPayment.marketplace_owner),
        splitStatus,
      },
      checks,
      settlementResult: params.settlementResult,
    };
  }

  private reconcileMercadoPagoNativeRecipient(params: {
    recipient: Record<string, unknown>;
    gatewayPayment: Record<string, unknown>;
    sourceTransactionId: string;
    canonicalStatus: string;
    checkedAt: string;
  }): Record<string, unknown> {
    const recipient = params.recipient;

    const paymentSplitRecipientId = this.requiredString(
      recipient._id,
      'paymentSplitRecipient._id',
    );

    const status = this.requiredString(
      recipient.status,
      'paymentSplitRecipient.status',
    );

    const gatewayTransferId = this.toNullableString(recipient.gatewayTransferId);
    const role = this.toNullableString(recipient.role);
    const amount = Number(recipient.amount ?? 0);
    const currency = this.requiredString(
      recipient.currency,
      'paymentSplitRecipient.currency',
    ).toLowerCase();

    const paymentIsPaid = params.canonicalStatus === 'paid';

    const checks = paymentIsPaid
      ? {
          statusMatched: status === PAYMENT_SPLIT_RECIPIENT_STATUS.TRANSFERRED,
          gatewayTransferIdMatched:
            gatewayTransferId !== null &&
            gatewayTransferId.startsWith(
              `mercado-pago-native:${params.sourceTransactionId}:`,
            ),
        }
      : {
          statusMatched: status !== PAYMENT_SPLIT_RECIPIENT_STATUS.TRANSFERRED,
          noGatewayTransferRequired: true,
        };

    const matched = Object.values(checks).every((value) => value === true);

    return {
      paymentSplitRecipientId,
      splitRecipientId: this.toNullableString(recipient.splitRecipientId),
      role,
      type: 'mercado_pago_native_split',
      status: matched ? 'matched' : 'mismatch',
      matched,
      checkedAt: params.checkedAt,
      gatewayTransferId,
      expected: paymentIsPaid
        ? {
            status: PAYMENT_SPLIT_RECIPIENT_STATUS.TRANSFERRED,
            gatewayTransferIdPrefix: `mercado-pago-native:${params.sourceTransactionId}:`,
            amount,
            currency,
          }
        : {
            status: 'not_transferred_until_payment_is_paid',
            amount,
            currency,
          },
      actual: {
        status,
        gatewayTransferId,
        amount,
        currency,
      },
      checks,
      providerResponse: {
        paymentId: this.toNullableString(params.gatewayPayment.id),
        paymentStatus: this.toNullableString(params.gatewayPayment.status),
        paymentStatusDetail: this.toNullableString(params.gatewayPayment.status_detail),
      },
    };
  }

  private async reconcileStripeRecipient(params: {
    recipient: Record<string, unknown>;
    paymentSplit: Record<string, unknown>;
    providerToken: string;
    sourceTransactionId: string | null;
    checkedAt: string;
  }): Promise<Record<string, unknown>> {
    const recipient = params.recipient;

    const paymentSplitRecipientId = this.requiredString(
      recipient._id,
      'paymentSplitRecipient._id',
    );

    const status = this.requiredString(
      recipient.status,
      'paymentSplitRecipient.status',
    );

    const amount = Number(recipient.amount ?? 0);
    const currency = this.requiredString(
      recipient.currency,
      'paymentSplitRecipient.currency',
    ).toLowerCase();

    if (this.shouldTreatAsRetainedRecipient(recipient)) {
      const retainedMatched =
        status === PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED &&
        this.toNullableString(recipient.gatewayTransferId) === null;

      return {
        paymentSplitRecipientId,
        splitRecipientId: this.toNullableString(recipient.splitRecipientId),
        role: this.toNullableString(recipient.role),
        type: 'retained_on_platform',
        status: retainedMatched ? 'matched' : 'mismatch',
        matched: retainedMatched,
        checkedAt: params.checkedAt,
        expected: {
          status: PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED,
          gatewayTransferId: null,
          retainedOnPlatform: true,
          amount,
          currency,
        },
        actual: {
          status,
          gatewayTransferId: this.toNullableString(recipient.gatewayTransferId),
          retainedOnPlatform: this.shouldTreatAsRetainedRecipient(recipient),
          amount,
          currency,
        },
        checks: {
          statusMatched: status === PAYMENT_SPLIT_RECIPIENT_STATUS.RETAINED,
          noGatewayTransferId: this.toNullableString(recipient.gatewayTransferId) === null,
        },
      };
    }

    const gatewayTransferId = this.requiredString(
      recipient.gatewayTransferId,
      `paymentSplitRecipient.gatewayTransferId:${paymentSplitRecipientId}`,
    );

    const stripeDtoOut = await this.retrieveStripeTransferService.exec(
      new RetrieveStripeTransferDtoIn({
        providerToken: params.providerToken,
        transferId: gatewayTransferId,
      }),
    );

    if (!stripeDtoOut.success || stripeDtoOut.transfer === null) {
      return {
        paymentSplitRecipientId,
        splitRecipientId: this.toNullableString(recipient.splitRecipientId),
        role: this.toNullableString(recipient.role),
        type: 'gateway_transfer',
        status: 'gateway_error',
        matched: false,
        checkedAt: params.checkedAt,
        gatewayTransferId,
        errorMessage: stripeDtoOut.errorMessage,
        providerResponse: stripeDtoOut.providerResponse,
      };
    }

    const transfer = stripeDtoOut.transfer;

    const destinationAccountId =
      this.resolveDestinationAccountId(recipient);

    const expectedTransferGroup = this.requiredString(
      params.paymentSplit._id,
      'paymentSplit._id',
    );

    const checks = {
      amountMatched: Number(transfer.amount ?? 0) === amount,
      currencyMatched:
        String(transfer.currency ?? '').trim().toLowerCase() === currency,
      destinationMatched:
        this.toNullableString(transfer.destination) === destinationAccountId,
      sourceTransactionMatched:
        params.sourceTransactionId === null
          ? true
          : this.toNullableString(transfer.source_transaction) ===
            params.sourceTransactionId,
      transferGroupMatched:
        this.toNullableString(transfer.transfer_group) === expectedTransferGroup,
      notReversed: transfer.reversed !== true,
    };

    const matched = Object.values(checks).every((value) => value === true);

    return {
      paymentSplitRecipientId,
      splitRecipientId: this.toNullableString(recipient.splitRecipientId),
      role: this.toNullableString(recipient.role),
      type: 'gateway_transfer',
      status: matched ? 'matched' : 'mismatch',
      matched,
      checkedAt: params.checkedAt,
      gatewayTransferId,
      expected: {
        amount,
        currency,
        destinationAccountId,
        sourceTransactionId: params.sourceTransactionId,
        transferGroup: expectedTransferGroup,
      },
      actual: {
        id: this.toNullableString(transfer.id),
        amount: Number(transfer.amount ?? 0),
        currency: this.toNullableString(transfer.currency),
        destinationAccountId: this.toNullableString(transfer.destination),
        sourceTransactionId: this.toNullableString(transfer.source_transaction),
        transferGroup: this.toNullableString(transfer.transfer_group),
        reversed: transfer.reversed === true,
      },
      checks,
      providerResponse: stripeDtoOut.providerResponse,
    };
  }

  private async persistRecipientReconciliation(params: {
    recipient: Record<string, unknown>;
    result: Record<string, unknown>;
    checkedAt: string;
  }): Promise<void> {
    const paymentSplitRecipientId = this.requiredString(
      params.recipient._id,
      'paymentSplitRecipient._id',
    );

    await this.updatePaymentSplitRecipientService.exec(
      new UpdatePaymentSplitRecipientDtoIn({
        _id: paymentSplitRecipientId,

        metadata: {
          ...(this.toObject(params.recipient.metadata) ?? {}),
          lastGatewayReconciliation: params.result,
          lastGatewayReconciledAt: params.checkedAt,
        },

        providerResponse: {
          ...(this.toObject(params.recipient.providerResponse) ?? {}),
          reconciliation: params.result,
        },

        gatewayResponse: {
          ...(this.toObject(params.recipient.gatewayResponse) ?? {}),
          reconciliation: params.result,
        },

        status: this.requiredString(
          params.recipient.status,
          'paymentSplitRecipient.status',
        ) as PaymentSplitRecipientStatus,

        source: 'ReconcilePaymentSplitWithGatewayUseCase.recipient',
      }),
    );
  }

  private buildSummary(params: {
    paymentSplitId: string;
    provider: string;
    checkedAt: string;
    reason: string | null;
    recipientResults: Array<Record<string, unknown>>;
    paymentResult?: Record<string, unknown> | null;
    settlementResult?: Record<string, unknown> | null;
  }): Record<string, unknown> {
    const matchedCount = params.recipientResults.filter(
      (result) => result.status === 'matched',
    ).length;

    const mismatchCount = params.recipientResults.filter(
      (result) => result.status === 'mismatch',
    ).length;

    const gatewayErrorCount = params.recipientResults.filter(
      (result) => result.status === 'gateway_error',
    ).length;

    const retainedCount = params.recipientResults.filter(
      (result) => result.type === 'retained_on_platform',
    ).length;

    const transferCount = params.recipientResults.filter(
      (result) => result.type === 'gateway_transfer',
    ).length;

    const mercadoPagoNativeCount = params.recipientResults.filter(
      (result) => result.type === 'mercado_pago_native_split',
    ).length;

    const paymentMatched =
      params.paymentResult === undefined ||
      params.paymentResult === null ||
      params.paymentResult.status === 'matched';

    const status =
      mismatchCount === 0 && gatewayErrorCount === 0 && paymentMatched
        ? 'reconciled'
        : 'mismatch';

    return {
      status,
      paymentSplitId: params.paymentSplitId,
      provider: params.provider,
      checkedAt: params.checkedAt,
      reason: params.reason,
      totalRecipients: params.recipientResults.length,
      matchedCount,
      mismatchCount,
      gatewayErrorCount,
      retainedCount,
      transferCount,
      mercadoPagoNativeCount,
      paymentResult: params.paymentResult ?? null,
      settlementResult: params.settlementResult ?? null,
    };
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

  private resolveDestinationAccountId(
    recipient: Record<string, unknown>,
  ): string | null {
    const direct =
      this.toNullableString(recipient.gatewayRecipientId) ??
      this.toNullableString(recipient.gateway_recipient_id) ??
      this.toNullableString(recipient.gatewayAccountId) ??
      this.toNullableString(recipient.gateway_account_id);

    if (direct !== null) {
      return direct;
    }

    const config = this.toObject(recipient.config);
    const metadata = this.toObject(recipient.metadata);

    return (
      this.extractString(config, 'stripeAccountId') ??
      this.extractString(config, 'stripe_account_id') ??
      this.extractString(config, 'gatewayRecipientId') ??
      this.extractString(config, 'gateway_recipient_id') ??
      this.extractString(config, 'gatewayAccountId') ??
      this.extractString(config, 'gateway_account_id') ??
      this.extractString(metadata, 'stripeAccountId') ??
      this.extractString(metadata, 'stripe_account_id') ??
      this.extractString(metadata, 'gatewayRecipientId') ??
      this.extractString(metadata, 'gateway_recipient_id') ??
      this.extractString(metadata, 'gatewayAccountId') ??
      this.extractString(metadata, 'gateway_account_id')
    );
  }

  private normalizeGatewayProvider(provider: string): NormalizedGatewayProvider {
    const normalized = provider.trim().toLowerCase();

    if (normalized === 'stripe') {
      return 'stripe';
    }

    if (
      normalized === 'mercadopago' ||
      normalized === 'mercado_pago' ||
      normalized === 'mercado-pago'
    ) {
      return 'mercado_pago';
    }

    throw new Error(`gateway reconciliation not implemented for: ${provider}`);
  }

  private resolveMercadoPagoSourceTransactionId(params: {
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
  }): string | null {
    return (
      this.toNullableString(params.paymentSplit.gatewaySplitId) ??
      this.toNullableString(params.paymentTransaction.gatewayTransactionId) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'metadata',
        'lastNativeSplitSettlement',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'metadata',
        'lastNativeSplitSettlement',
        'gatewayTransactionId',
      ]) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'providerResponse',
        'nativeSettlement',
        'sourceTransactionId',
      ]) ??
      this.extractNullableStringFromPath(params.paymentSplit, [
        'gatewayResponse',
        'nativeSettlement',
        'sourceTransactionId',
      ])
    );
  }

  private normalizeMercadoPagoPaymentStatus(
    gatewayPayment: Record<string, unknown>,
  ): string {
    const status = String(gatewayPayment.status ?? '').trim().toLowerCase();
    const statusDetail = String(gatewayPayment.status_detail ?? '')
      .trim()
      .toLowerCase();

    if (status === 'approved' || statusDetail === 'accredited') {
      return 'paid';
    }

    if (status === 'authorized') {
      return 'authorized';
    }

    if (status === 'pending' || status === 'in_process') {
      return 'pending';
    }

    if (status === 'rejected') {
      return 'failed';
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'canceled';
    }

    if (status === 'refunded') {
      return 'refunded';
    }

    if (status === 'charged_back') {
      return 'charged_back';
    }

    return status === '' ? 'unknown' : status;
  }

  private resolveExpectedMercadoPagoApplicationFeeInCents(
    recipients: Array<Record<string, unknown>>,
  ): number | null {
    const platformRecipient = recipients.find((recipient) => {
      const role = String(recipient.role ?? '').trim().toLowerCase();
      return role === 'platform' || role === 'marketplace';
    });

    if (!platformRecipient) {
      return null;
    }

    const amount = Number(platformRecipient.amount ?? 0);

    return Number.isFinite(amount) && amount > 0 ? amount : null;
  }

  private resolveMercadoPagoApplicationFeeAmount(
    gatewayPayment: Record<string, unknown>,
  ): number | null {
    const feeDetails = Array.isArray(gatewayPayment.fee_details)
      ? (gatewayPayment.fee_details as Array<unknown>)
      : [];

    for (const item of feeDetails) {
      const object = this.toObject(item);

      if (!object) {
        continue;
      }

      const type = String(object.type ?? '').trim().toLowerCase();

      if (type === 'application_fee') {
        const amount = Number(object.amount ?? 0);
        return Number.isFinite(amount) ? amount : null;
      }
    }

    const chargesDetails = Array.isArray(gatewayPayment.charges_details)
      ? (gatewayPayment.charges_details as Array<unknown>)
      : [];

    for (const item of chargesDetails) {
      const object = this.toObject(item);

      if (!object) {
        continue;
      }

      const name = String(object.name ?? '').trim().toLowerCase();
      const type = String(object.type ?? '').trim().toLowerCase();

      if (
        name !== 'application_fee' &&
        name !== 'third_payment' &&
        type !== 'application_fee'
      ) {
        continue;
      }

      const amounts = this.toObject(object.amounts);
      const original = Number(amounts?.original ?? object.amount ?? 0);

      return Number.isFinite(original) ? original : null;
    }

    return null;
  }

  private convertMercadoPagoAmountToCents(value: unknown): number | null {
    if (value === undefined || value === null) {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return null;
    }

    return Math.round(numberValue * 100);
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

  private extractString(
    object: Record<string, unknown> | null,
    key: string,
  ): string | null {
    if (object === null) {
      return null;
    }

    return this.toNullableString(object[key]);
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