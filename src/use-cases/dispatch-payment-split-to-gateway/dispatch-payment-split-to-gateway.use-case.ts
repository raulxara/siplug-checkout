import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { GatewaySplitTransferDtoIn } from '../../modules/gateway-split-transfers/dtos/gateway-split-transfer.dto-in';
import { DispatchGatewaySplitTransferService } from '../../modules/gateway-split-transfers/services/dispatch-gateway-split-transfer/dispatch-gateway-split-transfer.service';

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

import { DispatchPaymentSplitToGatewayDtoIn } from './dtos/dispatch-payment-split-to-gateway.dto-in';
import { DispatchPaymentSplitToGatewayDtoOut } from './dtos/dispatch-payment-split-to-gateway.dto-out';

type PaymentSplitRecipientTransferData = {
  paymentSplitRecipientId: string;
  splitRecipientId: string;
  destinationAccountId: string;
  amount: number;
  currency: string;
  role: string;
  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
};

@Injectable()
export class DispatchPaymentSplitToGatewayUseCase {
  constructor(
    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitService: UpdatePaymentSplitService,

    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly updatePaymentSplitRecipientService: UpdatePaymentSplitRecipientService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,

    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly dispatchGatewaySplitTransferService: DispatchGatewaySplitTransferService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: DispatchPaymentSplitToGatewayDtoIn,
  ): Promise<DispatchPaymentSplitToGatewayDtoOut> {
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

      if (currentStatus === 'transferred') {
        return new DispatchPaymentSplitToGatewayDtoOut(
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

      if (!['created', 'pending_gateway', 'processing_gateway'].includes(currentStatus)) {
        return new DispatchPaymentSplitToGatewayDtoOut(
          false,
          `payment split status does not allow gateway dispatch: ${currentStatus}`,
          paymentSplit,
          [],
          {
            skipped: true,
            reason: 'payment split status does not allow gateway dispatch',
            currentStatus,
          },
        );
      }

      if (String(paymentSplit.gatewayProvider ?? '').trim() !== dtoIn.provider) {
        throw new Error('payment split gateway provider does not match webhook provider');
      }

      if (
        String(paymentSplit.paymentTransactionId ?? '').trim() !==
        dtoIn.paymentTransactionId
      ) {
        throw new Error('payment split does not belong to payment transaction');
      }

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByUniqueIdService.exec(
          new FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId),
        );

      const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;

      if (!paymentTransaction.apiCredentialId) {
        throw new Error('payment transaction apiCredentialId is required');
      }

      const apiCredentialDtoOut =
        await this.findApiCredentialByUniqueIdService.exec(
          new FindApiCredentialByUniqueIdDtoIn(
            paymentTransaction.apiCredentialId,
          ),
        );

      const apiCredential = apiCredentialDtoOut.apiCredential;

      if (apiCredential.status !== 'active') {
        throw new Error('api credential is not active');
      }

      if (apiCredential.provider !== dtoIn.provider) {
        throw new Error('api credential provider does not match split provider');
      }

      const providerToken = this.resolveProviderToken(apiCredential);

      const recipientsDtoOut =
        await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
          new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
            dtoIn.paymentSplitId,
          ),
        );

      const paymentSplitRecipients = this.extractRecipients(recipientsDtoOut);

      if (paymentSplitRecipients.length === 0) {
        throw new Error('payment split must have at least one recipient');
      }

      const recipientsForGateway =
        this.buildRecipientsForGateway(paymentSplitRecipients);

      await this.updatePaymentSplitService.exec(
        new UpdatePaymentSplitDtoIn({
          _id: dtoIn.paymentSplitId,
          status: 'processing_gateway',
          providerPayload: {
            provider: dtoIn.provider,
            sourceTransactionId: dtoIn.sourceTransactionId,
            paymentTransactionId: dtoIn.paymentTransactionId,
            paymentWebhookEventId: dtoIn.paymentWebhookEventId,
            recipients: recipientsForGateway,
          },
          metadata: {
            ...(this.toObject(paymentSplit.metadata) ?? {}),
            lastGatewayDispatch: {
              provider: dtoIn.provider,
              sourceTransactionId: dtoIn.sourceTransactionId,
              paymentWebhookEventId: dtoIn.paymentWebhookEventId,
              eventId: dtoIn.eventId,
              eventType: dtoIn.eventType,
              eventAction: dtoIn.eventAction,
              canonicalStatus: dtoIn.canonicalStatus,
              startedAt: new Date().toISOString(),
            },
          },
          source: 'DispatchPaymentSplitToGatewayUseCase.processingGateway',
        }),
      );

      const gatewayDtoOut = await this.dispatchGatewaySplitTransferService.exec(
        new GatewaySplitTransferDtoIn({
          gatewayProvider: dtoIn.provider,
          providerToken,

          paymentSplitId: dtoIn.paymentSplitId,
          paymentTransactionId: dtoIn.paymentTransactionId,
          paymentWebhookEventId: dtoIn.paymentWebhookEventId,

          sourceTransactionId: dtoIn.sourceTransactionId,
          idempotencyKey: this.buildIdempotencyKey(dtoIn),

          recipients: recipientsForGateway,

          metadata: {
            source: 'DispatchPaymentSplitToGatewayUseCase',
            eventId: dtoIn.eventId,
            eventType: dtoIn.eventType,
            eventAction: dtoIn.eventAction,
            canonicalStatus: dtoIn.canonicalStatus,
          },
          config: null,
        }),
      );

      const updatedRecipients =
        await this.updateRecipientsAfterGatewayDispatch({
          currentRecipients: paymentSplitRecipients,
          transfers: gatewayDtoOut.transfers,
        });

      const finalSplitDtoOut = await this.updatePaymentSplitService.exec(
        new UpdatePaymentSplitDtoIn({
          _id: dtoIn.paymentSplitId,

          gatewaySplitId: gatewayDtoOut.gatewaySplitId,

          providerResponse: gatewayDtoOut.providerResponse,
          gatewayResponse: gatewayDtoOut.gatewayResponse,

          metadata: {
            ...(this.toObject(paymentSplit.metadata) ?? {}),
            lastGatewayDispatch: {
              provider: dtoIn.provider,
              sourceTransactionId: dtoIn.sourceTransactionId,
              paymentWebhookEventId: dtoIn.paymentWebhookEventId,
              eventId: dtoIn.eventId,
              eventType: dtoIn.eventType,
              eventAction: dtoIn.eventAction,
              canonicalStatus: dtoIn.canonicalStatus,
              finishedAt: new Date().toISOString(),
              status: gatewayDtoOut.status,
              dispatched: gatewayDtoOut.dispatched,
              errorMessage: gatewayDtoOut.errorMessage,
            },
          },

          status: gatewayDtoOut.status,

          source: 'DispatchPaymentSplitToGatewayUseCase.gatewayResult',
        }),
      );

      return new DispatchPaymentSplitToGatewayDtoOut(
        gatewayDtoOut.dispatched,
        gatewayDtoOut.dispatched
          ? 'payment split dispatched to gateway successfully'
          : gatewayDtoOut.errorMessage ?? 'payment split was not dispatched',
        finalSplitDtoOut.paymentSplit,
        updatedRecipients,
        {
          dispatched: gatewayDtoOut.dispatched,
          gatewayProvider: gatewayDtoOut.gatewayProvider,
          status: gatewayDtoOut.status,
          gatewaySplitId: gatewayDtoOut.gatewaySplitId,
          transfers: gatewayDtoOut.transfers,
          errorMessage: gatewayDtoOut.errorMessage,
        },
      );
    } catch (error) {
      await this.markSplitAsFailedSafe({
        paymentSplitId: dtoIn.paymentSplitId,
        error,
        provider: dtoIn.provider,
        sourceTransactionId: dtoIn.sourceTransactionId,
        paymentTransactionId: dtoIn.paymentTransactionId,
        paymentWebhookEventId: dtoIn.paymentWebhookEventId,
      });

      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'DispatchPaymentSplitToGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            paymentSplitId: dtoIn.paymentSplitId,
            paymentTransactionId: dtoIn.paymentTransactionId,
            paymentWebhookEventId: dtoIn.paymentWebhookEventId,
            provider: dtoIn.provider,
            sourceTransactionId: dtoIn.sourceTransactionId,
            eventId: dtoIn.eventId,
            eventType: dtoIn.eventType,
            canonicalStatus: dtoIn.canonicalStatus,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on dispatch payment split to gateway use case';

      throw new Error(message);
    }
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

  private buildRecipientsForGateway(
    recipients: Array<Record<string, unknown>>,
  ): PaymentSplitRecipientTransferData[] {
    return recipients
      .filter((recipient) => String(recipient.status ?? '') !== 'transferred')
      .map((recipient) => {
        const paymentSplitRecipientId = String(recipient._id ?? '').trim();
        const splitRecipientId = String(
          recipient.splitRecipientId ?? '',
        ).trim();

        const amount = Number(recipient.amount ?? 0);
        const currency = String(recipient.currency ?? 'BRL').trim();

        const destinationAccountId =
          this.resolveDestinationAccountId(recipient);

        if (paymentSplitRecipientId === '') {
          throw new Error('paymentSplitRecipient._id is required');
        }

        if (splitRecipientId === '') {
          throw new Error('paymentSplitRecipient.splitRecipientId is required');
        }

        if (!Number.isInteger(amount) || amount <= 0) {
          throw new Error(
            `payment split recipient amount must be greater than zero: ${paymentSplitRecipientId}`,
          );
        }

        if (currency === '') {
          throw new Error(
            `payment split recipient currency is required: ${paymentSplitRecipientId}`,
          );
        }

        if (destinationAccountId === null) {
          throw new Error(
            `gateway destination account id is required for payment split recipient: ${paymentSplitRecipientId}`,
          );
        }

        return {
          paymentSplitRecipientId,
          splitRecipientId,
          destinationAccountId,
          amount,
          currency,
          role: String(recipient.role ?? 'secondary'),
          metadata: this.toObject(recipient.metadata),
          config: this.toObject(recipient.config),
        };
      });
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

  private async updateRecipientsAfterGatewayDispatch(params: {
    currentRecipients: Array<Record<string, unknown>>;
    transfers: Array<Record<string, unknown>>;
  }): Promise<Array<Record<string, unknown>>> {
    const updatedRecipients: Array<Record<string, unknown>> = [];

    for (const transfer of params.transfers) {
      const paymentSplitRecipientId = String(
        transfer.paymentSplitRecipientId ?? '',
      ).trim();

      if (paymentSplitRecipientId === '') {
        continue;
      }

      const currentRecipient = params.currentRecipients.find(
        (recipient) => String(recipient._id ?? '').trim() === paymentSplitRecipientId,
      );

      const status = transfer.success === true ? 'transferred' : 'failed';

      const updatedDtoOut =
        await this.updatePaymentSplitRecipientService.exec(
          new UpdatePaymentSplitRecipientDtoIn({
            _id: paymentSplitRecipientId,

            gatewayRecipientId: this.toNullableString(
              transfer.destinationAccountId,
            ),

            gatewayTransferId: this.toNullableString(
              transfer.gatewayTransferId,
            ),

            providerResponse: {
              provider: 'stripe',
              transfer,
            },

            gatewayResponse: {
              provider: 'stripe',
              transfer,
            },

            metadata: {
              ...(this.toObject(currentRecipient?.metadata) ?? {}),
              lastGatewayTransfer: {
                provider: 'stripe',
                gatewayTransferId: this.toNullableString(
                  transfer.gatewayTransferId,
                ),
                success: transfer.success === true,
                statusCode: transfer.statusCode,
                processedAt: new Date().toISOString(),
              },
            },

            status,

            source:
              'DispatchPaymentSplitToGatewayUseCase.updateRecipientAfterGatewayDispatch',
          }),
        );

      updatedRecipients.push(
        updatedDtoOut.paymentSplitRecipient as Record<string, unknown>,
      );
    }

    return updatedRecipients;
  }

  private async markSplitAsFailedSafe(params: {
    paymentSplitId: string;
    error: unknown;
    provider: string;
    sourceTransactionId: string;
    paymentTransactionId: string;
    paymentWebhookEventId: string | null;
  }): Promise<void> {
    try {
      const message =
        params.error instanceof Error
          ? params.error.message
          : 'error on dispatch payment split to gateway';

      await this.updatePaymentSplitService.exec(
        new UpdatePaymentSplitDtoIn({
          _id: params.paymentSplitId,
          gatewayResponse: {
            provider: params.provider,
            sourceTransactionId: params.sourceTransactionId,
            paymentTransactionId: params.paymentTransactionId,
            paymentWebhookEventId: params.paymentWebhookEventId,
            errorMessage: message,
            failedAt: new Date().toISOString(),
          },
          status: 'failed',
          source: 'DispatchPaymentSplitToGatewayUseCase.failed',
        }),
      );
    } catch {
      // não lança para não ocultar o erro original
    }
  }

  private buildIdempotencyKey(
    dtoIn: DispatchPaymentSplitToGatewayDtoIn,
  ): string {
    return [
      'payment-split-transfer',
      dtoIn.provider,
      dtoIn.paymentSplitId,
      dtoIn.sourceTransactionId,
    ].join(':');
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

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
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
}
