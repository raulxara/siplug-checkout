import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { NormalizePicPayWebhookDtoIn } from '../../modules/payment-webhook-gateways/picpay/services/normalize-picpay-webhook/dtos/normalize-picpay-webhook.dto-in';
import { NormalizePicPayWebhookService } from '../../modules/payment-webhook-gateways/picpay/services/normalize-picpay-webhook/normalize-picpay-webhook.service';
import { ValidatePicPayWebhookDtoIn } from '../../modules/payment-webhook-gateways/picpay/services/validate-picpay-webhook/dtos/validate-picpay-webhook.dto-in';
import { ValidatePicPayWebhookService } from '../../modules/payment-webhook-gateways/picpay/services/validate-picpay-webhook/validate-picpay-webhook.service';

import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceivePicPayWebhookDtoIn } from './dtos/receive-picpay-webhook.dto-in';
import { ReceivePicPayWebhookDtoOut } from './dtos/receive-picpay-webhook.dto-out';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

@Injectable()
export class ReceivePicPayWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly validatePicPayWebhookService: ValidatePicPayWebhookService,
    private readonly normalizePicPayWebhookService: NormalizePicPayWebhookService,

    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,
    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceivePicPayWebhookDtoIn,
  ): Promise<ReceivePicPayWebhookDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const validationDtoOut = this.validatePicPayWebhookService.exec(
        new ValidatePicPayWebhookDtoIn({
          authorization: dtoIn.authorization,
          webhookToken: credentialData.webhookToken,
          authMode: credentialData.authMode,
        }),
      );

      const normalizedDtoOut = this.normalizePicPayWebhookService.exec(
        new NormalizePicPayWebhookDtoIn({
          payload: dtoIn.payload,
          headers: dtoIn.headers,
          eventTypeHeader: dtoIn.eventTypeHeader,
        }),
      );

      const normalizedEvent =
        await this.enrichPicPayNormalizedEventWithInternalReferences(
          normalizedDtoOut.normalizedEvent,
        );

      const sanitizedPayload = this.sanitizeSensitiveGatewayData(dtoIn.payload);

      const registeredDtoOut =
        await this.registerPaymentWebhookEventService.exec(
          new RegisterPaymentWebhookEventDtoIn({
            provider: normalizedEvent.provider,
            eventId: normalizedEvent.eventId,
            eventType: normalizedEvent.eventType,
            eventAction: normalizedEvent.eventAction,
            canonicalStatus: normalizedEvent.canonicalStatus,

            gatewayTransactionId: normalizedEvent.gatewayTransactionId,
            gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
            gatewayChargeId: normalizedEvent.gatewayChargeId,
            gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
            gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

            paymentTransactionId: normalizedEvent.paymentTransactionId,
            checkoutSessionId: normalizedEvent.checkoutSessionId,
            subscriptionId: normalizedEvent.subscriptionId,
            subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
            externalReference: normalizedEvent.externalReference,

            amount: normalizedEvent.amount,
            currency: normalizedEvent.currency,

            headers: normalizedEvent.headers,
            payload: sanitizedPayload,
            normalizedPayload: {
              provider: normalizedEvent.provider,
              eventId: normalizedEvent.eventId,
              eventType: normalizedEvent.eventType,
              eventAction: normalizedEvent.eventAction,
              canonicalStatus: normalizedEvent.canonicalStatus,

              gatewayTransactionId: normalizedEvent.gatewayTransactionId,
              gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
              gatewayChargeId: normalizedEvent.gatewayChargeId,

              paymentTransactionId: normalizedEvent.paymentTransactionId,
              checkoutSessionId: normalizedEvent.checkoutSessionId,
              gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
              gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

              subscriptionId: normalizedEvent.subscriptionId,
              subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
              externalReference: normalizedEvent.externalReference,

              amount: normalizedEvent.amount,
              currency: normalizedEvent.currency,
            },

            metadata: {
              source: 'ReceivePicPayWebhookUseCase',
              apiCredentialId: dtoIn.apiCredentialId,
              signature: {
                valid: validationDtoOut.valid,
                skipped: validationDtoOut.skipped,
                reason: validationDtoOut.reason,
              },
            },
            config: null,
          }),
        );

      if (registeredDtoOut.wasAlreadyRegistered) {
        return new ReceivePicPayWebhookDtoOut(
          registeredDtoOut.paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'picpay webhook event already registered',
            eventId: normalizedEvent.eventId,
          },
          true,
        );
      }

      const processedDtoOut =
        await this.processPaymentWebhookEventUseCase.exec(
          new ProcessPaymentWebhookEventDtoIn({
            paymentWebhookEventId: String(
              registeredDtoOut.paymentWebhookEvent._id,
            ),
            normalizedEvent,
          }),
        );

      return new ReceivePicPayWebhookDtoOut(
        processedDtoOut.paymentWebhookEvent,
        processedDtoOut.paymentTransaction,
        processedDtoOut.processingResult,
        false,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceivePicPayWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
            payload: this.sanitizeSensitiveGatewayData(dtoIn.payload),
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive picpay webhook use case';

      throw new Error(message);
    }
  }

  private async resolveCredentialData(apiCredentialId: string): Promise<{
    webhookToken: string | null;
    authMode: 'required' | 'optional';
  }> {
    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;

    if (apiCredential.status !== 'active') {
      throw new Error('api credential is not active');
    }

    const normalizedProvider = this.normalizeProvider(apiCredential.provider);

    if (normalizedProvider !== 'picpay') {
      throw new Error('api credential provider must be picpay');
    }

    const config = this.toRecordOrNull(apiCredential.config);

    const webhookToken =
      this.extractString(config, 'webhookToken') ??
      this.extractString(config, 'webhook_token');

    const authMode =
      this.extractString(config, 'webhookAuthMode') === 'required'
        ? 'required'
        : 'optional';

    if (
      webhookToken !== null &&
      webhookToken.startsWith('enc::')
    ) {
      const decryptedConfigDtoOut =
        this.decryptApiCredentialSecretService.exec(
          new DecryptApiCredentialSecretDtoIn({
            apiCredential: {
              config: {
                webhookToken,
              },
            },
            keysToDecrypt: ['webhookToken'],
            strict: true,
          }),
        );

      const decryptedConfig = this.toRecordOrNull(
        decryptedConfigDtoOut.apiCredential.config,
      );

      return {
        webhookToken: this.extractString(decryptedConfig, 'webhookToken'),
        authMode,
      };
    }

    return {
      webhookToken,
      authMode,
    };
  }

  private async enrichPicPayNormalizedEventWithInternalReferences(
    normalizedEvent: NormalizedPaymentWebhookEventDto,
  ): Promise<NormalizedPaymentWebhookEventDto> {
    const paymentTransaction =
      await this.resolvePaymentTransactionFromPicPayEvent(normalizedEvent);

    if (paymentTransaction === null) {
      return normalizedEvent;
    }

    const transactionMetadata = this.toRecordOrNull(
      paymentTransaction.metadata,
    );

    const transactionConfig = this.toRecordOrNull(
      paymentTransaction.config,
    );

    const providerPayload = this.toRecordOrNull(
      paymentTransaction.providerPayload,
    );

    const providerPayloadMetadata = this.toRecordOrNull(
      providerPayload?.metadata,
    );

    return new NormalizedPaymentWebhookEventDto({
      provider: normalizedEvent.provider,
      eventId: normalizedEvent.eventId,
      eventType: normalizedEvent.eventType,
      eventAction: normalizedEvent.eventAction,
      canonicalStatus: normalizedEvent.canonicalStatus,

      gatewayTransactionId: normalizedEvent.gatewayTransactionId,
      gatewayPaymentIntentId: normalizedEvent.gatewayPaymentIntentId,
      gatewayChargeId: normalizedEvent.gatewayChargeId,
      gatewaySubscriptionId: null,
      gatewayInvoiceId: null,

      paymentTransactionId:
        normalizedEvent.paymentTransactionId ??
        this.extractString(paymentTransaction, '_id'),

      checkoutSessionId:
        normalizedEvent.checkoutSessionId ??
        this.extractString(paymentTransaction, 'checkoutSessionId') ??
        this.extractString(paymentTransaction, 'checkout_session_id') ??
        this.extractString(transactionMetadata, 'checkoutSessionId') ??
        this.extractString(transactionMetadata, 'checkout_session_id') ??
        this.extractString(providerPayloadMetadata, 'checkoutSessionId') ??
        this.extractString(providerPayloadMetadata, 'checkout_session_id'),

      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference: normalizedEvent.externalReference,
      amount: normalizedEvent.amount,
      currency: normalizedEvent.currency,

      rawPayload: normalizedEvent.rawPayload,
      headers: normalizedEvent.headers,
    });
  }

  private async resolvePaymentTransactionFromPicPayEvent(
    normalizedEvent: NormalizedPaymentWebhookEventDto,
  ): Promise<Record<string, unknown> | null> {
    const paymentTransactionIds = [
      normalizedEvent.paymentTransactionId,
      normalizedEvent.externalReference,
      this.restoreUuidFromCompactString(normalizedEvent.externalReference),
    ].filter((value): value is string => value !== null);

    for (const paymentTransactionId of paymentTransactionIds) {
      const paymentTransaction =
        await this.findPaymentTransactionByUniqueIdSafe(paymentTransactionId);

      if (paymentTransaction !== null) {
        return paymentTransaction;
      }
    }

    const gatewayTransactionIds = [
      normalizedEvent.gatewayTransactionId,
      normalizedEvent.gatewayChargeId,
      normalizedEvent.gatewayPaymentIntentId,
      normalizedEvent.gatewayInvoiceId,
      normalizedEvent.gatewaySubscriptionId,
      normalizedEvent.externalReference,
    ].filter((value): value is string => value !== null);

    for (const gatewayTransactionId of gatewayTransactionIds) {
      const paymentTransaction =
        await this.findPaymentTransactionByGatewayTransactionIdSafe(
          gatewayTransactionId,
        );

      if (paymentTransaction !== null) {
        return paymentTransaction;
      }
    }

    return null;
  }

  private async findPaymentTransactionByUniqueIdSafe(
    paymentTransactionId: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(
        new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
      );

      return dtoOut.paymentTransaction as unknown as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private restoreUuidFromCompactString(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    const normalized = value.trim().toLowerCase();

    if (!/^[a-f0-9]{32}$/.test(normalized)) {
      return null;
    }

    return [
      normalized.slice(0, 8),
      normalized.slice(8, 12),
      normalized.slice(12, 16),
      normalized.slice(16, 20),
      normalized.slice(20),
    ].join('-');
  }

  private async findPaymentTransactionByGatewayTransactionIdSafe(
    gatewayTransactionId: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      const dtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
          new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
          ),
        );

      return dtoOut.paymentTransaction as unknown as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private normalizeProvider(provider: unknown): string {
    const value = String(provider ?? '').trim().toLowerCase();

    if (['picpay', 'pic-pay', 'pic_pay'].includes(value)) {
      return 'picpay';
    }

    return value;
  }

  private sanitizeSensitiveGatewayData(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeSensitiveGatewayData(item));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    const sanitized: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();

      if (
        [
          'card',
          'token',
          'cardtoken',
          'transparenttoken',
          'encrypted_card',
          'encryptedcard',
          'security_code',
          'cvv',
          'cvc',
          'number',
          'authorization',
        ].includes(normalizedKey)
      ) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      sanitized[key] = this.sanitizeSensitiveGatewayData(item);
    }

    return sanitized;
  }

  private toRecordOrNull(value: unknown): Record<string, unknown> | null {
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

    const value = object[key];

    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}