import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { NormalizeStripeWebhookDtoIn } from '../../modules/payment-webhook-gateways/stripe/services/normalize-stripe-webhook/dtos/normalize-stripe-webhook.dto-in';
import { NormalizeStripeWebhookService } from '../../modules/payment-webhook-gateways/stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service';
import { ValidateStripeWebhookDtoIn } from '../../modules/payment-webhook-gateways/stripe/services/validate-stripe-webhook/dtos/validate-stripe-webhook.dto-in';
import { ValidateStripeWebhookService } from '../../modules/payment-webhook-gateways/stripe/services/validate-stripe-webhook/validate-stripe-webhook.service';

import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceiveStripeWebhookDtoIn } from './dtos/receive-stripe-webhook.dto-in';
import { ReceiveStripeWebhookDtoOut } from './dtos/receive-stripe-webhook.dto-out';

import { ProcessSubscriptionWebhookEventDtoIn } from '../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in';
import { ProcessSubscriptionWebhookEventUseCase } from '../process-subscription-webhook-event/process-subscription-webhook-event.use-case';

@Injectable()
export class ReceiveStripeWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly validateStripeWebhookService: ValidateStripeWebhookService,
    private readonly normalizeStripeWebhookService: NormalizeStripeWebhookService,
    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,
    private readonly processSubscriptionWebhookEventUseCase: ProcessSubscriptionWebhookEventUseCase,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveStripeWebhookDtoIn,
  ): Promise<ReceiveStripeWebhookDtoOut> {
    try {
      const endpointSecret = await this.resolveEndpointSecretFromApiCredential(
        dtoIn.apiCredentialId,
      );

      await this.validateStripeWebhookService.exec(
        new ValidateStripeWebhookDtoIn({
          rawBody: dtoIn.rawBody,
          stripeSignature: dtoIn.stripeSignature,
          endpointSecret,
          toleranceInSeconds: 300,
        }),
      );

      const normalizedDtoOut = this.normalizeStripeWebhookService.exec(
        new NormalizeStripeWebhookDtoIn({
          payload: dtoIn.payload,
          headers: dtoIn.headers,
        }),
      );

      const normalizedEvent = normalizedDtoOut.normalizedEvent;

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
            payload: normalizedEvent.rawPayload,
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
              source: 'ReceiveStripeWebhookUseCase',
              apiCredentialId: dtoIn.apiCredentialId,
            },
            config: null,
          }),
        );

      const paymentWebhookEvent =
        registeredDtoOut.paymentWebhookEvent as Record<string, unknown>;

      if (
        registeredDtoOut.wasAlreadyRegistered &&
        String(paymentWebhookEvent.status) === 'processed'
      ) {
        return new ReceiveStripeWebhookDtoOut(
          paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'webhook event already processed',
            provider: normalizedEvent.provider,
            eventId: normalizedEvent.eventId,
          },
          true,
        );
      }

      const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();

      if (paymentWebhookEventId === '') {
        throw new Error('paymentWebhookEvent._id is required');
      }

      const processedDtoOut =
        await this.processPaymentWebhookEventUseCase.exec(
          new ProcessPaymentWebhookEventDtoIn({
            paymentWebhookEventId,
            normalizedEvent,
          }),
        );

      const subscriptionProcessedDtoOut =
        await this.processSubscriptionWebhookEventUseCase.exec(
          new ProcessSubscriptionWebhookEventDtoIn({
            paymentWebhookEventId,
            normalizedEvent,
            paymentTransaction: processedDtoOut.paymentTransaction,
            paymentProcessingResult: processedDtoOut.processingResult,
          }),
        );

      return new ReceiveStripeWebhookDtoOut(
        subscriptionProcessedDtoOut.paymentWebhookEvent,
        subscriptionProcessedDtoOut.paymentTransaction,
        {
          paymentProcessingResult: processedDtoOut.processingResult,
          subscriptionProcessingResult:
            subscriptionProcessedDtoOut.processingResult,
        },
        registeredDtoOut.wasAlreadyRegistered,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceiveStripeWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            provider: 'stripe',
            apiCredentialId: dtoIn.apiCredentialId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive Stripe webhook use case';

      throw new Error(message);
    }
  }

  private async resolveEndpointSecretFromApiCredential(
    apiCredentialId: string,
  ): Promise<string> {
    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;

    if (apiCredential.status !== 'active') {
      throw new Error('api credential is not active');
    }

    if (apiCredential.provider !== 'stripe') {
      throw new Error('api credential provider must be stripe');
    }

    const decryptedDtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: apiCredential.config ?? {},
        },
        keysToDecrypt: ['webhookSecret', 'webhook_secret'],
        strict: false,
      }),
    );

    const config = decryptedDtoOut.apiCredential.config;

    const webhookSecret =
      this.extractStringFromConfig(config, 'webhookSecret') ??
      this.extractStringFromConfig(config, 'webhook_secret');

    if (webhookSecret === null) {
      throw new Error('api credential config.webhookSecret is required');
    }

    if (!webhookSecret.startsWith('whsec_')) {
      throw new Error('api credential config.webhookSecret must start with whsec_');
    }

    return webhookSecret;
  }

  private extractStringFromConfig(
    config: unknown,
    key: string,
  ): string | null {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      return null;
    }

    const value = (config as Record<string, unknown>)[key];

    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }
}
