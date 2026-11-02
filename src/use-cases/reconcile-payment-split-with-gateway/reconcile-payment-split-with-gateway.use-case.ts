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
import { MarkNativePaymentSplitAsTransferredDtoIn } from '../../modules/payment-splits/services/mark-native-payment-split-as-transferred/dtos/mark-native-payment-split-as-transferred.dto-in';
import { MarkNativePaymentSplitAsTransferredService } from '../../modules/payment-splits/services/mark-native-payment-split-as-transferred/mark-native-payment-split-as-transferred.service';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ReconcilePaymentSplitWithGatewayDtoIn } from './dtos/reconcile-payment-split-with-gateway.dto-in';
import { ReconcilePaymentSplitWithGatewayDtoOut } from './dtos/reconcile-payment-split-with-gateway.dto-out';

type NormalizedGatewayProvider = 'stripe' | 'mercado_pago' | 'pagseguro';

type MercadoPagoPaymentReconciliationResult = {
  updatedPaymentSplit: Record<string, unknown>;
  recipientResults: Array<Record<string, unknown>>;
  paymentResult: Record<string, unknown>;
  settlementResult: Record<string, unknown> | null;
  gatewayPayment: Record<string, unknown>;
};

type PagSeguroSplitReconciliationResult = {
  updatedPaymentSplit: Record<string, unknown>;
  recipientResults: Array<Record<string, unknown>>;
  paymentResult: Record<string, unknown>;
  settlementResult: Record<string, unknown> | null;
};

@Injectable()
export class ReconcilePaymentSplitWithGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitService: UpdatePaymentSplitService,
    private readonly markNativePaymentSplitAsTransferredService: MarkNativePaymentSplitAsTransferredService,

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
        config: Record<string, unknown> | null;
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

      if (provider === 'pagseguro') {
        const pagSeguroResult = await this.reconcilePagSeguroNativeSplit({
          dtoIn,
          paymentSplit,
          paymentTransaction,
          providerToken,
          apiCredentialConfig: apiCredential.config,
          recipients,
          checkedAt,
        });

        const summary = this.buildSummary({
          paymentSplitId: dtoIn.paymentSplitId,
          provider,
          checkedAt,
          reason: dtoIn.reason,
          recipientResults: pagSeguroResult.recipientResults,
          paymentResult: pagSeguroResult.paymentResult,
          settlementResult: pagSeguroResult.settlementResult,
        });

        const reconciled = summary.status === 'reconciled';
        let updatedPaymentSplit = pagSeguroResult.updatedPaymentSplit;

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
          pagSeguroResult.recipientResults,
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

  private async reconcilePagSeguroNativeSplit(params: {
    dtoIn: ReconcilePaymentSplitWithGatewayDtoIn;
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
    providerToken: string;
    apiCredentialConfig: Record<string, unknown> | null;
    recipients: Array<Record<string, unknown>>;
    checkedAt: string;
  }): Promise<PagSeguroSplitReconciliationResult> {
    const chargeId = this.requiredString(
      this.toNullableString(params.paymentTransaction.gatewayTransactionId) ??
        this.extractNullableStringFromPath(params.paymentSplit, [
          'providerPayload',
          'nativeSettlement',
          'sourceTransactionId',
        ]),
      'pagseguro.chargeId',
    );

    if (!chargeId.startsWith('CHAR_')) {
      throw new Error('PagSeguro payment transaction must contain a CHAR_ charge id');
    }

    const baseUrl = this.resolvePagSeguroBaseUrl(params.apiCredentialConfig);
    const gatewayCharge = await this.getPagSeguroResource({
      baseUrl,
      path: `/charges/${chargeId}`,
      providerToken: params.providerToken,
      resource: 'charge',
    });
    const splitId = this.resolvePagSeguroSplitId({
      paymentSplit: params.paymentSplit,
      gatewayCharge,
    });
    const gatewaySplit =
      splitId === null
        ? null
        : await this.getPagSeguroResource({
            baseUrl,
            path: `/splits/${splitId}`,
            providerToken: params.providerToken,
            resource: 'split',
          });

    const canonicalStatus = this.normalizePagSeguroChargeStatus(gatewayCharge);
    const refundedAmount = this.extractPagSeguroRefundedAmount(gatewayCharge);
    const totalAmount = this.extractPagSeguroChargeAmount(gatewayCharge);
    const expectedSplitStatus = this.resolvePagSeguroInternalSplitStatus({
      canonicalStatus,
      refundedAmount,
      totalAmount,
    });

    let updatedPaymentSplit = params.paymentSplit;
    let effectiveRecipients = params.recipients;
    let settlementResult: Record<string, unknown> | null = null;

    if (
      canonicalStatus === 'paid' &&
      refundedAmount === 0 &&
      !['transferred', 'partially_transferred'].includes(
        this.requiredString(params.paymentSplit.status, 'paymentSplit.status'),
      ) &&
      params.dtoIn.persistResult
    ) {
      const settlementDtoOut =
        await this.markNativePaymentSplitAsTransferredService.exec(
          new MarkNativePaymentSplitAsTransferredDtoIn({
            paymentSplitId: this.requiredString(params.paymentSplit._id, 'paymentSplit._id'),
            paymentTransactionId: this.requiredString(
              params.paymentTransaction._id,
              'paymentTransaction._id',
            ),
            provider: 'pagseguro',
            sourceTransactionId: chargeId,
            eventId: `manual-reconcile:${chargeId}:${params.checkedAt}`,
            eventType: 'charge',
            eventAction: 'manual.reconcile',
            settlementMode: 'native_split',
          }),
        );

      if (settlementDtoOut.nativeSettled && settlementDtoOut.paymentSplit) {
        updatedPaymentSplit = settlementDtoOut.paymentSplit;
        effectiveRecipients = settlementDtoOut.paymentSplitRecipients;
        settlementResult = settlementDtoOut.gatewayResult;
      }
    }

    const recipientResults = effectiveRecipients.map((recipient) =>
      this.reconcilePagSeguroNativeRecipient({
        recipient,
        gatewaySplit,
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
          await this.persistPagSeguroRecipientReconciliation({
            recipient,
            result,
            checkedAt: params.checkedAt,
          });
        }
      }
    }

    const paymentResult = this.buildPagSeguroPaymentResult({
      paymentSplit: updatedPaymentSplit,
      paymentTransaction: params.paymentTransaction,
      gatewayCharge,
      gatewaySplit,
      chargeId,
      splitId,
      canonicalStatus,
      refundedAmount,
      totalAmount,
      expectedSplitStatus,
      checkedAt: params.checkedAt,
      settlementResult,
    });

    if (params.dtoIn.persistResult) {
      const updatedDtoOut = await this.updatePaymentSplitService.exec(
        new UpdatePaymentSplitDtoIn({
          _id: this.requiredString(params.paymentSplit._id, 'paymentSplit._id'),
          gatewaySplitId: splitId ?? undefined,
          status: expectedSplitStatus ?? undefined,
          source: 'ReconcilePaymentSplitWithGatewayUseCase.pagseguro',
        }),
      );
      updatedPaymentSplit = updatedDtoOut.paymentSplit as Record<string, unknown>;
    }

    return {
      updatedPaymentSplit,
      recipientResults,
      paymentResult,
      settlementResult,
    };
  }

  private async getPagSeguroResource(params: {
    baseUrl: string;
    path: string;
    providerToken: string;
    resource: string;
  }): Promise<Record<string, unknown>> {
    const response = await fetch(`${params.baseUrl}${params.path}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${params.providerToken}` },
    });
    const responseBody = this.parseJson(await response.text());

    if (!response.ok || responseBody === null) {
      const message =
        this.extractString(responseBody, 'message') ??
        this.extractString(responseBody, 'error') ??
        `PagSeguro ${params.resource} query failed with status ${response.status}`;
      throw new Error(message);
    }

    return responseBody;
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

  private reconcilePagSeguroNativeRecipient(params: {
    recipient: Record<string, unknown>;
    gatewaySplit: Record<string, unknown> | null;
    canonicalStatus: string;
    checkedAt: string;
  }): Record<string, unknown> {
    const accountId = this.resolvePagSeguroRecipientAccountId(params.recipient);
    const receiver = this.findPagSeguroReceiver(params.gatewaySplit, accountId);
    const refundedAmount = this.toNumberFromPath(receiver, ['amount', 'refunded']) ?? 0;
    const allocatedAmount = this.toNumberFromPath(receiver, ['amount', 'value']);
    const originalAmount = Number(params.recipient.amount ?? 0);
    const expectedStatus = this.resolvePagSeguroRecipientStatus({
      canonicalStatus: params.canonicalStatus,
      refundedAmount,
      originalAmount,
    });
    const actualStatus = this.requiredString(
      params.recipient.status,
      'paymentSplitRecipient.status',
    );
    const splitMethod = this.toNullableString(params.gatewaySplit?.method);
    const expectedAllocation =
      splitMethod === 'PERCENTAGE'
        ? Number(params.recipient.percentage ?? 0)
        : originalAmount;
    const checks = {
      splitFound: params.gatewaySplit !== null,
      receiverFound: receiver !== null,
      accountMatched: accountId !== null && this.toNullableString(this.toObject(receiver?.account)?.id) === accountId,
      allocationMatched:
        allocatedAmount === null || expectedAllocation <= 0
          ? true
          : allocatedAmount === expectedAllocation,
      statusMatched: expectedStatus === null || actualStatus === expectedStatus,
    };
    const matched = Object.values(checks).every((value) => value === true);

    return {
      paymentSplitRecipientId: this.requiredString(params.recipient._id, 'paymentSplitRecipient._id'),
      splitRecipientId: this.toNullableString(params.recipient.splitRecipientId),
      role: this.toNullableString(params.recipient.role),
      type: 'pagseguro_native_split',
      status: matched ? 'matched' : 'mismatch',
      matched,
      checkedAt: params.checkedAt,
      gatewayRecipientId: accountId,
      expected: {
        status: expectedStatus,
        accountId,
        allocation: expectedAllocation,
        splitMethod,
      },
      actual: {
        status: actualStatus,
        refundedAmount,
        allocatedAmount,
        accountId: this.toNullableString(this.toObject(receiver?.account)?.id),
      },
      checks,
      providerResponse: receiver,
    };
  }

  private async persistPagSeguroRecipientReconciliation(params: {
    recipient: Record<string, unknown>;
    result: Record<string, unknown>;
    checkedAt: string;
  }): Promise<void> {
    const expected = this.toObject(params.result.expected);
    const expectedStatus = this.toNullableString(expected?.status);

    await this.updatePaymentSplitRecipientService.exec(
      new UpdatePaymentSplitRecipientDtoIn({
        _id: this.requiredString(params.recipient._id, 'paymentSplitRecipient._id'),
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
        status:
          expectedStatus ??
          this.requiredString(
            params.recipient.status,
            'paymentSplitRecipient.status',
          ),
        source: 'ReconcilePaymentSplitWithGatewayUseCase.pagseguroRecipient',
      }),
    );
  }

  private buildPagSeguroPaymentResult(params: {
    paymentSplit: Record<string, unknown>;
    paymentTransaction: Record<string, unknown>;
    gatewayCharge: Record<string, unknown>;
    gatewaySplit: Record<string, unknown> | null;
    chargeId: string;
    splitId: string | null;
    canonicalStatus: string;
    refundedAmount: number;
    totalAmount: number | null;
    expectedSplitStatus: string | null;
    checkedAt: string;
    settlementResult: Record<string, unknown> | null;
  }): Record<string, unknown> {
    const expectedAmount = Number(params.paymentTransaction.amount ?? 0);
    const actualCurrency = this.toNullableString(
      this.toObject(params.gatewayCharge.amount)?.currency,
    );
    const expectedCurrency = this.toNullableString(
      params.paymentTransaction.currency,
    )?.toUpperCase() ?? null;
    const expectedReference = this.toNullableString(
      params.paymentTransaction.externalReference,
    );
    const actualReference = this.toNullableString(params.gatewayCharge.reference_id);
    const actualSplitStatus = this.toNullableString(params.paymentSplit.status);
    const checks = {
      chargeIdMatched: this.toNullableString(params.gatewayCharge.id) === params.chargeId,
      amountMatched: params.totalAmount === expectedAmount,
      currencyMatched: actualCurrency?.toUpperCase() === expectedCurrency,
      externalReferenceMatched:
        expectedReference === null || actualReference === expectedReference,
      splitFound: params.splitId !== null && params.gatewaySplit !== null,
      splitIdMatched:
        params.splitId === null || this.toNullableString(params.gatewaySplit?.id) === params.splitId,
      splitStatusMatched:
        params.expectedSplitStatus === null ||
        actualSplitStatus === params.expectedSplitStatus,
    };

    return {
      type: 'pagseguro_charge_and_split',
      status: Object.values(checks).every((value) => value === true)
        ? 'matched'
        : 'mismatch',
      matched: Object.values(checks).every((value) => value === true),
      checkedAt: params.checkedAt,
      canonicalStatus: params.canonicalStatus,
      expected: {
        chargeId: params.chargeId,
        amountInCents: expectedAmount,
        currency: expectedCurrency,
        externalReference: expectedReference,
        splitStatus: params.expectedSplitStatus,
      },
      actual: {
        chargeId: this.toNullableString(params.gatewayCharge.id),
        splitId: params.splitId,
        amountInCents: params.totalAmount,
        refundedAmountInCents: params.refundedAmount,
        currency: actualCurrency,
        externalReference: actualReference,
        gatewayStatus: this.toNullableString(params.gatewayCharge.status),
        splitStatus: actualSplitStatus,
      },
      checks,
      gatewayCharge: params.gatewayCharge,
      gatewaySplit: params.gatewaySplit,
      settlementResult: params.settlementResult,
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

    const pagSeguroNativeCount = params.recipientResults.filter(
      (result) => result.type === 'pagseguro_native_split',
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
      pagSeguroNativeCount,
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

  private resolvePagSeguroBaseUrl(
    apiCredentialConfig: Record<string, unknown> | null,
  ): string {
    const configuredBaseUrl = this.toNullableString(
      apiCredentialConfig?.baseUrl,
    );

    return (configuredBaseUrl ?? 'https://api.pagseguro.com').replace(/\/+$/, '');
  }

  private resolvePagSeguroSplitId(params: {
    paymentSplit: Record<string, unknown>;
    gatewayCharge: Record<string, unknown>;
  }): string | null {
    const storedSplitId = this.toNullableString(params.paymentSplit.gatewaySplitId);

    if (storedSplitId?.startsWith('SPLI_')) {
      return storedSplitId;
    }

    const links = Array.isArray(params.gatewayCharge.links)
      ? params.gatewayCharge.links
      : [];

    for (const link of links) {
      const item = this.toObject(link);

      if (this.toNullableString(item?.rel) !== 'SPLIT') {
        continue;
      }

      const splitId = this.toNullableString(item?.href)?.split('/').pop()?.trim();

      if (splitId?.startsWith('SPLI_')) {
        return splitId;
      }
    }

    return null;
  }

  private normalizePagSeguroChargeStatus(
    gatewayCharge: Record<string, unknown>,
  ): string {
    const status = this.toNullableString(gatewayCharge.status)?.toUpperCase();

    if (status === 'PAID') {
      return 'paid';
    }

    if (status === 'CANCELED') {
      return 'refunded';
    }

    if (status === 'AUTHORIZED') {
      return 'authorized';
    }

    if (status === 'WAITING' || status === 'IN_ANALYSIS') {
      return 'pending';
    }

    if (status === 'DECLINED') {
      return 'failed';
    }

    return status?.toLowerCase() ?? 'unknown';
  }

  private extractPagSeguroChargeAmount(
    gatewayCharge: Record<string, unknown>,
  ): number | null {
    return this.toNumberFromPath(gatewayCharge, ['amount', 'value']);
  }

  private extractPagSeguroRefundedAmount(
    gatewayCharge: Record<string, unknown>,
  ): number {
    return this.toNumberFromPath(gatewayCharge, ['amount', 'summary', 'refunded']) ?? 0;
  }

  private resolvePagSeguroInternalSplitStatus(params: {
    canonicalStatus: string;
    refundedAmount: number;
    totalAmount: number | null;
  }): string | null {
    if (params.refundedAmount > 0) {
      return params.totalAmount !== null && params.refundedAmount >= params.totalAmount
        ? 'reversed'
        : 'partially_reversed';
    }

    return params.canonicalStatus === 'paid' ? 'transferred' : null;
  }

  private resolvePagSeguroRecipientStatus(params: {
    canonicalStatus: string;
    refundedAmount: number;
    originalAmount: number;
  }): string | null {
    if (params.refundedAmount > 0) {
      return params.refundedAmount >= params.originalAmount
        ? PAYMENT_SPLIT_RECIPIENT_STATUS.REVERSED
        : PAYMENT_SPLIT_RECIPIENT_STATUS.PARTIALLY_REVERSED;
    }

    return params.canonicalStatus === 'paid'
      ? PAYMENT_SPLIT_RECIPIENT_STATUS.TRANSFERRED
      : null;
  }

  private resolvePagSeguroRecipientAccountId(
    recipient: Record<string, unknown>,
  ): string | null {
    const direct = this.toNullableString(recipient.gatewayRecipientId);

    if (direct?.startsWith('ACCO_')) {
      return direct;
    }

    const config = this.toObject(recipient.config);
    const directConfigId = this.toNullableString(config?.pagseguroAccountId);

    if (directConfigId?.startsWith('ACCO_')) {
      return directConfigId;
    }

    return this.toNullableString(
      this.toObject(this.toObject(config?.gatewayAccounts)?.pagseguro)?.accountId,
    );
  }

  private findPagSeguroReceiver(
    gatewaySplit: Record<string, unknown> | null,
    accountId: string | null,
  ): Record<string, unknown> | null {
    if (gatewaySplit === null || accountId === null) {
      return null;
    }

    const receivers = Array.isArray(gatewaySplit.receivers)
      ? gatewaySplit.receivers
      : [];

    return (
      receivers
        .map((receiver) => this.toObject(receiver))
        .find(
          (receiver) =>
            this.toNullableString(this.toObject(receiver?.account)?.id) === accountId,
        ) ?? null
    );
  }

  private toNumberFromPath(
    object: Record<string, unknown> | null,
    path: string[],
  ): number | null {
    let current: unknown = object;

    for (const key of path) {
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        return null;
      }

      current = (current as Record<string, unknown>)[key];
    }

    const value = Number(current);
    return Number.isFinite(value) ? value : null;
  }

  private parseJson(value: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(value);
      return this.toObject(parsed);
    } catch {
      return null;
    }
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

    if (['pagseguro', 'pagbank', 'pag-bank', 'pag_seguro'].includes(normalized)) {
      return 'pagseguro';
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
