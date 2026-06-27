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

import { ProcessSubscriptionWebhookEventDtoIn } from '../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in';
import { ProcessSubscriptionWebhookEventUseCase } from '../process-subscription-webhook-event/process-subscription-webhook-event.use-case';

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
    private readonly processSubscriptionWebhookEventUseCase: ProcessSubscriptionWebhookEventUseCase,
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

      const enrichedNormalizedEvent =
        await this.enrichPagSeguroNormalizedEventWithInternalReferences(
          normalizedDtoOut.normalizedEvent,
        );

      const normalizedEvents = this.buildPagSeguroWebhookEffects({
        originalEvent: enrichedNormalizedEvent,
        payload: dtoIn.payload,
      });

      const sanitizedPayload = this.sanitizeSensitiveGatewayData(dtoIn.payload);

      const processedEffects: Record<string, unknown>[] = [];

      let primaryPaymentWebhookEvent: Record<string, unknown> | null = null;
      let primaryPaymentTransaction: Record<string, unknown> | null = null;
      let wasAlreadyRegistered = false;

      for (const eventToProcess of normalizedEvents) {
        const registeredDtoOut =
          await this.registerPaymentWebhookEventService.exec(
            new RegisterPaymentWebhookEventDtoIn({
              provider: eventToProcess.provider,
              eventId: eventToProcess.eventId,
              eventType: eventToProcess.eventType,
              eventAction: eventToProcess.eventAction,
              canonicalStatus: eventToProcess.canonicalStatus,

              gatewayTransactionId: eventToProcess.gatewayTransactionId,
              gatewayPaymentIntentId: eventToProcess.gatewayPaymentIntentId,
              gatewayChargeId: eventToProcess.gatewayChargeId,
              gatewaySubscriptionId: eventToProcess.gatewaySubscriptionId,
              gatewayInvoiceId: eventToProcess.gatewayInvoiceId,

              paymentTransactionId: eventToProcess.paymentTransactionId,
              checkoutSessionId: eventToProcess.checkoutSessionId,
              subscriptionId: eventToProcess.subscriptionId,
              subscriptionInvoiceId: eventToProcess.subscriptionInvoiceId,
              externalReference: eventToProcess.externalReference,

              amount: eventToProcess.amount,
              currency: eventToProcess.currency,

              headers: eventToProcess.headers,
              payload: sanitizedPayload,
              normalizedPayload: {
                provider: eventToProcess.provider,
                eventId: eventToProcess.eventId,
                eventType: eventToProcess.eventType,
                eventAction: eventToProcess.eventAction,
                canonicalStatus: eventToProcess.canonicalStatus,

                gatewayTransactionId: eventToProcess.gatewayTransactionId,
                gatewayPaymentIntentId: eventToProcess.gatewayPaymentIntentId,
                gatewayChargeId: eventToProcess.gatewayChargeId,
                gatewaySubscriptionId: eventToProcess.gatewaySubscriptionId,
                gatewayInvoiceId: eventToProcess.gatewayInvoiceId,

                paymentTransactionId: eventToProcess.paymentTransactionId,
                checkoutSessionId: eventToProcess.checkoutSessionId,
                subscriptionId: eventToProcess.subscriptionId,
                subscriptionInvoiceId: eventToProcess.subscriptionInvoiceId,
                externalReference: eventToProcess.externalReference,

                amount: eventToProcess.amount,
                currency: eventToProcess.currency,
              },

              metadata: {
                source: 'ReceivePagSeguroWebhookUseCase',
                apiCredentialId: dtoIn.apiCredentialId,
                effect: {
                  eventType: eventToProcess.eventType,
                  eventAction: eventToProcess.eventAction,
                  canonicalStatus: eventToProcess.canonicalStatus,
                },
                signature: {
                  valid: validationDtoOut.valid,
                  skipped: validationDtoOut.skipped,
                  reason: validationDtoOut.reason,
                },
              },
              config: null,
            }),
          );

        const paymentWebhookEvent =
          registeredDtoOut.paymentWebhookEvent as Record<string, unknown>;

        if (primaryPaymentWebhookEvent === null) {
          primaryPaymentWebhookEvent = paymentWebhookEvent;
        }

        wasAlreadyRegistered =
          wasAlreadyRegistered || registeredDtoOut.wasAlreadyRegistered;

        if (
          registeredDtoOut.wasAlreadyRegistered &&
          String(paymentWebhookEvent.status) === 'processed'
        ) {
          processedEffects.push({
            ignored: true,
            reason: 'pagseguro webhook effect already processed',
            provider: eventToProcess.provider,
            eventId: eventToProcess.eventId,
            eventType: eventToProcess.eventType,
            eventAction: eventToProcess.eventAction,
            canonicalStatus: eventToProcess.canonicalStatus,
          });

          continue;
        }

        const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();

        if (paymentWebhookEventId === '') {
          throw new Error('paymentWebhookEvent._id is required');
        }

        const paymentProcessedDtoOut =
          await this.processPaymentWebhookEventUseCase.exec(
            new ProcessPaymentWebhookEventDtoIn({
              paymentWebhookEventId,
              normalizedEvent: eventToProcess,
            }),
          );

        const subscriptionProcessedDtoOut =
          await this.processSubscriptionWebhookEventUseCase.exec(
            new ProcessSubscriptionWebhookEventDtoIn({
              paymentWebhookEventId,
              normalizedEvent: eventToProcess,
              paymentProcessingResult: paymentProcessedDtoOut.processingResult,
            }),
          );

        if (
          primaryPaymentTransaction === null &&
          paymentProcessedDtoOut.paymentTransaction !== null
        ) {
          primaryPaymentTransaction =
            paymentProcessedDtoOut.paymentTransaction as Record<string, unknown>;
        }

        processedEffects.push({
          ignored: false,
          provider: eventToProcess.provider,
          eventId: eventToProcess.eventId,
          eventType: eventToProcess.eventType,
          eventAction: eventToProcess.eventAction,
          canonicalStatus: eventToProcess.canonicalStatus,
          paymentProcessingResult: paymentProcessedDtoOut.processingResult,
          subscriptionProcessingResult:
            subscriptionProcessedDtoOut.processingResult,
        });
      }

      if (primaryPaymentWebhookEvent === null) {
        throw new Error('pagseguro webhook event was not registered');
      }

      return new ReceivePagSeguroWebhookDtoOut(
        primaryPaymentWebhookEvent,
        primaryPaymentTransaction,
        {
          ignored: false,
          provider: 'pagseguro',
          effectsTotal: processedEffects.length,
          effects: processedEffects,
        },
        wasAlreadyRegistered,
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

  private buildPagSeguroWebhookEffects(params: {
    originalEvent: NormalizedPaymentWebhookEventDto;
    payload: Record<string, unknown>;
  }): NormalizedPaymentWebhookEventDto[] {
    const events: NormalizedPaymentWebhookEventDto[] = [
      params.originalEvent,
    ];

    const paidEffect = this.buildPagSeguroPaidEffectFromSubscriptionWebhook({
      originalEvent: params.originalEvent,
      payload: params.payload,
    });

    if (paidEffect !== null) {
      events.push(paidEffect);
    }

    return events;
  }

  private buildPagSeguroPaidEffectFromSubscriptionWebhook(params: {
    originalEvent: NormalizedPaymentWebhookEventDto;
    payload: Record<string, unknown>;
  }): NormalizedPaymentWebhookEventDto | null {
    if (params.originalEvent.provider !== 'pagseguro') {
      return null;
    }

    if (params.originalEvent.eventType !== 'subscription') {
      return null;
    }

    if (params.originalEvent.canonicalStatus !== 'subscription_active') {
      return null;
    }

    const resource = this.extractObject(params.payload, 'resource');

    if (resource === null) {
      return null;
    }

    const currentInvoice = this.extractObject(resource, 'current_invoice');

    if (currentInvoice === null) {
      return null;
    }

    const invoiceStatus = this.extractString(currentInvoice, 'status');
    const paidAt = this.extractString(currentInvoice, 'paid_at');

    const payments = currentInvoice.payments;

    const approvedPayment = Array.isArray(payments)
      ? payments
          .map((payment) => this.asRecord(payment))
          .find((payment) => {
            const paymentStatus = this.extractString(payment, 'status');

            return paymentStatus === 'APPROVED' || paymentStatus === 'PAID';
          }) ?? null
      : null;

    if (
      invoiceStatus !== 'PAID' &&
      paidAt === null &&
      approvedPayment === null
    ) {
      return null;
    }

    const invoiceId = this.extractString(currentInvoice, 'id');
    const paymentId = this.extractString(approvedPayment, 'id');

    const amountObject = this.extractObject(currentInvoice, 'amount');

    const amount =
      this.extractNumber(amountObject, 'value') ?? params.originalEvent.amount;

    const currency =
      this.extractString(amountObject, 'currency') ??
      params.originalEvent.currency;

    const eventId = [
      params.originalEvent.gatewaySubscriptionId ??
        params.originalEvent.gatewayTransactionId ??
        params.originalEvent.eventId,
      invoiceId ?? 'invoice',
      paymentId ?? 'payment',
      'PAID',
    ].join(':');

    return new NormalizedPaymentWebhookEventDto({
      provider: params.originalEvent.provider,
      eventId,
      eventType: 'subscription_invoice',
      eventAction: 'subscription_invoice.paid',
      canonicalStatus: 'paid',

      gatewayTransactionId:
        params.originalEvent.gatewayTransactionId ??
        params.originalEvent.gatewaySubscriptionId,

      gatewayPaymentIntentId:
        paymentId ??
        invoiceId ??
        params.originalEvent.gatewayPaymentIntentId,

      gatewayChargeId: paymentId,
      gatewaySubscriptionId: params.originalEvent.gatewaySubscriptionId,
      gatewayInvoiceId: invoiceId,

      paymentTransactionId: params.originalEvent.paymentTransactionId,
      checkoutSessionId: params.originalEvent.checkoutSessionId,
      subscriptionId: params.originalEvent.subscriptionId,
      subscriptionInvoiceId: params.originalEvent.subscriptionInvoiceId,

      externalReference: params.originalEvent.externalReference,

      amount,
      currency,

      rawPayload: {
        pagseguro: params.payload,
        derivedEffect: {
          sourceEventId: params.originalEvent.eventId,
          sourceEventType: params.originalEvent.eventType,
          sourceEventAction: params.originalEvent.eventAction,
          sourceCanonicalStatus: params.originalEvent.canonicalStatus,
          reason:
            'PagSeguro subscription.initial contains current_invoice PAID with APPROVED payment',
          currentInvoice,
        },
      },

      headers: params.originalEvent.headers,
    });
  }

  private extractFirstPaymentId(
    currentInvoice: Record<string, unknown>,
  ): string | null {
    const payments = currentInvoice.payments;

    if (!Array.isArray(payments)) {
      return null;
    }

    for (const payment of payments) {
      const paymentObject = this.asRecord(payment);

      if (paymentObject === null) {
        continue;
      }

      const paymentId = this.extractString(paymentObject, 'id');

      if (paymentId !== null) {
        return paymentId;
      }
    }

    return null;
  }

  private extractObject(
    object: Record<string, unknown> | null,
    key: string,
  ): Record<string, unknown> | null {
    if (object === null) {
      return null;
    }

    return this.asRecord(object[key]);
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
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

  private extractNumber(
    object: Record<string, unknown> | null,
    key: string,
  ): number | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

    if (value === undefined || value === null || value === '') {
      return null;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
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
}
