import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { NormalizePagSeguroWebhookDtoIn } from '../../modules/payment-webhook-gateways/pagseguro/services/normalize-pagseguro-webhook/dtos/normalize-pagseguro-webhook.dto-in';
import { NormalizePagSeguroWebhookService } from '../../modules/payment-webhook-gateways/pagseguro/services/normalize-pagseguro-webhook/normalize-pagseguro-webhook.service';
import { ValidatePagSeguroWebhookDtoIn } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/dtos/validate-pagseguro-webhook.dto-in';
import { ValidatePagSeguroWebhookService } from '../../modules/payment-webhook-gateways/pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service';

import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceivePagSeguroWebhookDtoIn } from './dtos/receive-pagseguro-webhook.dto-in';
import { ReceivePagSeguroWebhookDtoOut } from './dtos/receive-pagseguro-webhook.dto-out';
import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

@Injectable()
export class ReceivePagSeguroWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly validatePagSeguroWebhookService: ValidatePagSeguroWebhookService,
    private readonly normalizePagSeguroWebhookService: NormalizePagSeguroWebhookService,

    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,

    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceivePagSeguroWebhookDtoIn,
  ): Promise<ReceivePagSeguroWebhookDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const validationDtoOut = this.validatePagSeguroWebhookService.exec(
        new ValidatePagSeguroWebhookDtoIn({
          rawBody: dtoIn.rawBody,
          token: credentialData.token,
          xAuthenticityToken: dtoIn.xAuthenticityToken,
          signatureMode: credentialData.signatureMode,
        }),
      );

      const normalizedDtoOut = this.normalizePagSeguroWebhookService.exec(
        new NormalizePagSeguroWebhookDtoIn({
          payload: dtoIn.payload,
          headers: dtoIn.headers,
        }),
      );

      const normalizedEvent = await this.enrichPagSeguroNormalizedEventWithInternalReferences(
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
              gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
              gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

              paymentTransactionId: normalizedEvent.paymentTransactionId,
              checkoutSessionId: normalizedEvent.checkoutSessionId,
              subscriptionId: normalizedEvent.subscriptionId,
              subscriptionInvoiceId: normalizedEvent.subscriptionInvoiceId,
              externalReference: normalizedEvent.externalReference,

              amount: normalizedEvent.amount,
              currency: normalizedEvent.currency,
            },

            metadata: {
              source: 'ReceivePagSeguroWebhookUseCase',
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
        return new ReceivePagSeguroWebhookDtoOut(
          registeredDtoOut.paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'pagseguro webhook event already registered',
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

      return new ReceivePagSeguroWebhookDtoOut(
        processedDtoOut.paymentWebhookEvent,
        processedDtoOut.paymentTransaction,
        processedDtoOut.processingResult,
        false,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceivePagSeguroWebhookUseCase',
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
          : 'error on receive pagseguro webhook use case';

      throw new Error(message);
    }
  }

  private async enrichPagSeguroNormalizedEventWithInternalReferences(
    normalizedEvent: NormalizedPaymentWebhookEventDto,
  ): Promise<NormalizedPaymentWebhookEventDto> {
    const paymentTransaction =
      await this.resolvePaymentTransactionFromPagSeguroEvent(normalizedEvent);

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
      gatewaySubscriptionId: normalizedEvent.gatewaySubscriptionId,
      gatewayInvoiceId: normalizedEvent.gatewayInvoiceId,

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

      subscriptionId:
        normalizedEvent.subscriptionId ??
        this.extractString(paymentTransaction, 'subscriptionId') ??
        this.extractString(paymentTransaction, 'subscription_id') ??
        this.extractString(transactionMetadata, 'subscriptionId') ??
        this.extractString(transactionMetadata, 'subscription_id') ??
        this.extractString(transactionConfig, 'subscriptionId') ??
        this.extractString(transactionConfig, 'subscription_id') ??
        this.extractString(providerPayloadMetadata, 'subscriptionId') ??
        this.extractString(providerPayloadMetadata, 'subscription_id'),

      subscriptionInvoiceId:
        normalizedEvent.subscriptionInvoiceId ??
        this.extractString(paymentTransaction, 'subscriptionInvoiceId') ??
        this.extractString(paymentTransaction, 'subscription_invoice_id') ??
        this.extractString(transactionMetadata, 'subscriptionInvoiceId') ??
        this.extractString(transactionMetadata, 'subscription_invoice_id') ??
        this.extractString(transactionConfig, 'subscriptionInvoiceId') ??
        this.extractString(transactionConfig, 'subscription_invoice_id') ??
        this.extractString(providerPayloadMetadata, 'subscriptionInvoiceId') ??
        this.extractString(providerPayloadMetadata, 'subscription_invoice_id'),

      externalReference: normalizedEvent.externalReference,
      amount: normalizedEvent.amount,
      currency: normalizedEvent.currency,

      rawPayload: normalizedEvent.rawPayload,
      headers: normalizedEvent.headers,
    });
  }

  private async resolvePaymentTransactionFromPagSeguroEvent(
    normalizedEvent: NormalizedPaymentWebhookEventDto,
  ): Promise<Record<string, unknown> | null> {
    const attempts = 3;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const paymentTransaction =
        await this.resolvePaymentTransactionFromPagSeguroEventOnce(
          normalizedEvent,
        );

      if (paymentTransaction !== null) {
        return paymentTransaction;
      }

      if (attempt < attempts) {
        await this.delay(800);
      }
    }

    return null;
  }

  private async resolvePaymentTransactionFromPagSeguroEventOnce(
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

  private async delay(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
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

  private async resolveCredentialData(apiCredentialId: string): Promise<{
    token: string;
    signatureMode: 'required' | 'optional';
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

    if (normalizedProvider !== 'pagseguro') {
      throw new Error('api credential provider must be pagseguro');
    }

    if (apiCredential.token === null || apiCredential.token.trim() === '') {
      throw new Error('PagSeguro api credential token is required');
    }

    const decryptedTokenDtoOut = this.decryptApiCredentialSecretService.exec(
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

    const tokenConfig = this.toRecordOrNull(
      decryptedTokenDtoOut.apiCredential.config,
    );

    const token = this.extractString(tokenConfig, 'token');

    if (token === null) {
      throw new Error('PagSeguro decrypted token is required');
    }

    const config = this.toRecordOrNull(apiCredential.config);

    const signatureMode =
      this.extractString(config, 'webhookSignatureMode') === 'required'
        ? 'required'
        : 'optional';

    return {
      token,
      signatureMode,
    };
  }

  private normalizeProvider(provider: unknown): string {
    const value = String(provider ?? '').trim().toLowerCase();

    if (['pagseguro', 'pag-bank', 'pagbank', 'pag_seguro'].includes(value)) {
      return 'pagseguro';
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
          'encrypted_card',
          'encryptedcard',
          'security_code',
          'cvv',
          'cvc',
          'number',
          'holder',
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
