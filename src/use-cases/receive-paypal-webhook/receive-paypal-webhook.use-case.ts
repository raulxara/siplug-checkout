import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { NormalizePayPalWebhookDtoIn } from '../../modules/payment-webhook-gateways/paypal/services/normalize-paypal-webhook/dtos/normalize-paypal-webhook.dto-in';
import { NormalizePayPalWebhookService } from '../../modules/payment-webhook-gateways/paypal/services/normalize-paypal-webhook/normalize-paypal-webhook.service';
import { ValidatePayPalWebhookDtoIn } from '../../modules/payment-webhook-gateways/paypal/services/validate-paypal-webhook/dtos/validate-paypal-webhook.dto-in';
import { ValidatePayPalWebhookService } from '../../modules/payment-webhook-gateways/paypal/services/validate-paypal-webhook/validate-paypal-webhook.service';

import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceivePayPalWebhookDtoIn } from './dtos/receive-paypal-webhook.dto-in';
import { ReceivePayPalWebhookDtoOut } from './dtos/receive-paypal-webhook.dto-out';

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { CapturePayPalOrderReturnDtoIn } from '../capture-paypal-order-return/dtos/capture-paypal-order-return.dto-in';
import { CapturePayPalOrderReturnUseCase } from '../capture-paypal-order-return/capture-paypal-order-return.use-case';

type PayPalCredentialData = {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  webhookId: string | null;
  webhookAuthMode: string;
};

type PayPalOAuthResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
  message?: string;
  [key: string]: unknown;
};

@Injectable()
export class ReceivePayPalWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly validatePayPalWebhookService: ValidatePayPalWebhookService,
    private readonly normalizePayPalWebhookService: NormalizePayPalWebhookService,
    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,

    private readonly capturePayPalOrderReturnUseCase: CapturePayPalOrderReturnUseCase,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceivePayPalWebhookDtoIn,
  ): Promise<ReceivePayPalWebhookDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const accessToken = await this.createAccessToken(credentialData);

      const validationDtoOut = await this.validatePayPalWebhookService.exec(
        new ValidatePayPalWebhookDtoIn({
          baseUrl: credentialData.baseUrl,
          accessToken,
          webhookId: credentialData.webhookId,
          authMode: credentialData.webhookAuthMode,
          payload: dtoIn.payload,
          headers: dtoIn.headers,
        }),
      );

      const normalizedDtoOut = this.normalizePayPalWebhookService.exec(
        new NormalizePayPalWebhookDtoIn({
            payload: dtoIn.payload,
            headers: dtoIn.headers,
        }),
        );

        const normalizedEvent =
        await this.enrichNormalizedEventWithPaymentTransactionData(
            normalizedDtoOut.normalizedEvent,
        );

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
              source: 'ReceivePayPalWebhookUseCase',
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

      const paymentWebhookEvent =
        registeredDtoOut.paymentWebhookEvent as Record<string, unknown>;

      if (
        registeredDtoOut.wasAlreadyRegistered &&
        String(paymentWebhookEvent.status) === 'processed'
      ) {
        return new ReceivePayPalWebhookDtoOut(
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

      const autoCaptureDtoOut = await this.autoCaptureApprovedPayPalOrderIfNeeded({
        apiCredentialId: dtoIn.apiCredentialId,
        normalizedEvent,
      });

      if (autoCaptureDtoOut !== null) {
        return new ReceivePayPalWebhookDtoOut(
          autoCaptureDtoOut.paymentWebhookEvent,
          autoCaptureDtoOut.paymentTransaction,
          {
            sourceWebhook: processedDtoOut.processingResult,
            autoCapture: autoCaptureDtoOut.processingResult,
          },
          registeredDtoOut.wasAlreadyRegistered,
        );
      }

      return new ReceivePayPalWebhookDtoOut(
        processedDtoOut.paymentWebhookEvent,
        processedDtoOut.paymentTransaction,
        processedDtoOut.processingResult,
        registeredDtoOut.wasAlreadyRegistered,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceivePayPalWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            provider: 'paypal',
            apiCredentialId: dtoIn.apiCredentialId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive PayPal webhook use case';

      throw new Error(message);
    }
  }

  private async resolveCredentialData(
    apiCredentialId: string,
  ): Promise<PayPalCredentialData> {
    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;

    if (apiCredential.status !== 'active') {
      throw new Error('api credential is not active');
    }

    if (this.normalizeProvider(apiCredential.provider) !== 'paypal') {
      throw new Error('api credential provider must be paypal');
    }

    const config = this.toRecordOrNull(apiCredential.config);

    const clientId =
      this.extractString(config, 'clientId') ??
      this.extractString(config, 'client_id');

    if (clientId === null) {
      throw new Error('PayPal clientId is required in api credential config');
    }

    if (apiCredential.token === null || apiCredential.token.trim() === '') {
      throw new Error('PayPal clientSecret/token is required');
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

    const decryptedConfig = this.toRecordOrNull(
      decryptedTokenDtoOut.apiCredential.config,
    );

    const clientSecret = this.extractString(decryptedConfig, 'token');

    if (clientSecret === null) {
      throw new Error('PayPal decrypted clientSecret/token is required');
    }

    const baseUrl = (
      this.extractString(config, 'baseUrl') ??
      this.extractString(config, 'base_url') ??
      'https://api-m.sandbox.paypal.com'
    ).replace(/\/+$/, '');

    const webhookId =
      this.extractString(config, 'paypalWebhookId') ??
      this.extractString(config, 'paypal_webhook_id') ??
      this.extractString(config, 'webhookId') ??
      this.extractString(config, 'webhook_id');

    const webhookAuthMode =
      this.extractString(config, 'webhookAuthMode') ??
      this.extractString(config, 'webhook_auth_mode') ??
      (webhookId === null ? 'optional' : 'required');

    return {
      clientId,
      clientSecret,
      baseUrl,
      webhookId,
      webhookAuthMode,
    };
  }

  private async createAccessToken(
    credentialData: PayPalCredentialData,
  ): Promise<string> {
    const basicAuth = Buffer.from(
      `${credentialData.clientId}:${credentialData.clientSecret}`,
      'utf8',
    ).toString('base64');

    const response = await fetch(`${credentialData.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
    });

    const responseBody = (await response.json().catch(() => ({
      message: 'PayPal returned a non JSON OAuth response',
    }))) as PayPalOAuthResponse;

    if (!response.ok) {
      throw new Error(
        this.extractString(responseBody, 'error_description') ??
          this.extractString(responseBody, 'message') ??
          this.extractString(responseBody, 'error') ??
          `PayPal OAuth request failed with status ${response.status}`,
      );
    }

    const accessToken = this.extractString(responseBody, 'access_token');

    if (accessToken === null) {
      throw new Error('PayPal access_token was not returned');
    }

    return accessToken;
  }

  private normalizeProvider(provider: unknown): string {
    const value = String(provider ?? '').trim().toLowerCase();

    if (['paypal', 'pay-pal', 'pay_pal'].includes(value)) {
      return 'paypal';
    }

    return value;
  }

  private toRecordOrNull(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private async enrichNormalizedEventWithPaymentTransactionData(
    event: NormalizedPaymentWebhookEventDto,
    ): Promise<NormalizedPaymentWebhookEventDto> {
    const paymentTransaction = await this.resolvePaymentTransactionFromEvent(event);

    if (paymentTransaction === null) {
        return event;
    }

    const paymentTransactionId =
        event.paymentTransactionId ?? this.toNullableString(paymentTransaction._id);

    const checkoutSessionId =
        event.checkoutSessionId ??
        this.toNullableString(paymentTransaction.checkoutSessionId);

    if (
        paymentTransactionId === event.paymentTransactionId &&
        checkoutSessionId === event.checkoutSessionId
    ) {
        return event;
    }

    return new NormalizedPaymentWebhookEventDto({
        provider: event.provider,
        eventId: event.eventId,
        eventType: event.eventType,
        eventAction: event.eventAction,
        canonicalStatus: event.canonicalStatus,

        gatewayTransactionId: event.gatewayTransactionId,
        gatewayPaymentIntentId: event.gatewayPaymentIntentId,
        gatewayChargeId: event.gatewayChargeId,
        gatewaySubscriptionId: event.gatewaySubscriptionId,
        gatewayInvoiceId: event.gatewayInvoiceId,

        paymentTransactionId,
        checkoutSessionId,
        subscriptionId: event.subscriptionId,
        subscriptionInvoiceId: event.subscriptionInvoiceId,
        externalReference: event.externalReference,

        amount: event.amount,
        currency: event.currency,

        rawPayload: event.rawPayload,
        headers: event.headers,
    });
    }

    private async resolvePaymentTransactionFromEvent(
    event: NormalizedPaymentWebhookEventDto,
    ): Promise<PaymentTransactionRow | null> {
    if (event.paymentTransactionId !== null) {
        const found = await this.findPaymentTransactionByUniqueIdSafe(
        event.paymentTransactionId,
        );

        if (found !== null) {
        return found;
        }
    }

    const gatewayTransactionIds = [
        event.gatewayTransactionId,
        event.gatewayPaymentIntentId,
        event.gatewayChargeId,
    ].filter((value): value is string => value !== null);

    for (const gatewayTransactionId of gatewayTransactionIds) {
        const found = await this.findPaymentTransactionByGatewayTransactionIdSafe(
        gatewayTransactionId,
        );

        if (found !== null) {
        return found;
        }
    }

    return null;
    }

    private async findPaymentTransactionByUniqueIdSafe(
    paymentTransactionId: string,
    ): Promise<PaymentTransactionRow | null> {
    try {
        const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(
        new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
        );

        return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
        return null;
    }
    }

    private async findPaymentTransactionByGatewayTransactionIdSafe(
    gatewayTransactionId: string,
    ): Promise<PaymentTransactionRow | null> {
    try {
        const dtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
            new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
            ),
        );

        return dtoOut.paymentTransaction as unknown as PaymentTransactionRow;
    } catch {
        return null;
    }
    }

    private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
        return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
    }

  private async autoCaptureApprovedPayPalOrderIfNeeded(params: {
    apiCredentialId: string;
    normalizedEvent: NormalizedPaymentWebhookEventDto;
  }): Promise<{
    paymentWebhookEvent: Record<string, unknown>;
    paymentTransaction: Record<string, unknown> | null;
    processingResult: Record<string, unknown>;
  } | null> {
    const event = params.normalizedEvent;

    if (event.provider !== 'paypal') {
      return null;
    }

    if (event.eventType !== 'CHECKOUT.ORDER.APPROVED') {
      return null;
    }

    if (event.canonicalStatus !== 'pending') {
      return null;
    }

    const orderId =
      event.gatewayTransactionId ??
      event.gatewayPaymentIntentId;

    if (orderId === null || orderId.trim() === '') {
      return null;
    }

    const captureDtoOut = await this.capturePayPalOrderReturnUseCase.exec(
      new CapturePayPalOrderReturnDtoIn({
        apiCredentialId: params.apiCredentialId,
        orderId,
      }),
    );

    return {
      paymentWebhookEvent: captureDtoOut.paymentWebhookEvent,
      paymentTransaction: captureDtoOut.paymentTransaction,
      processingResult: {
        ...(captureDtoOut.processingResult ?? {}),
        autoCapturedFromWebhook: true,
        sourceEventType: event.eventType,
        sourceEventId: event.eventId,
        orderId,
      },
    };
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
