import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { GetMercadoPagoPaymentDtoIn } from '../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/dtos/get-mercado-pago-payment.dto-in';
import { GetMercadoPagoPaymentService } from '../../modules/payment-webhook-gateways/mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service';
import { NormalizeMercadoPagoWebhookDtoIn } from '../../modules/payment-webhook-gateways/mercado-pago/services/normalize-mercado-pago-webhook/dtos/normalize-mercado-pago-webhook.dto-in';
import { NormalizeMercadoPagoWebhookService } from '../../modules/payment-webhook-gateways/mercado-pago/services/normalize-mercado-pago-webhook/normalize-mercado-pago-webhook.service';
import { ValidateMercadoPagoWebhookDtoIn } from '../../modules/payment-webhook-gateways/mercado-pago/services/validate-mercado-pago-webhook/dtos/validate-mercado-pago-webhook.dto-in';
import { ValidateMercadoPagoWebhookService } from '../../modules/payment-webhook-gateways/mercado-pago/services/validate-mercado-pago-webhook/validate-mercado-pago-webhook.service';

import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { ReceiveMercadoPagoWebhookDtoIn } from './dtos/receive-mercado-pago-webhook.dto-in';
import { ReceiveMercadoPagoWebhookDtoOut } from './dtos/receive-mercado-pago-webhook.dto-out';

@Injectable()
export class ReceiveMercadoPagoWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly validateMercadoPagoWebhookService: ValidateMercadoPagoWebhookService,
    private readonly getMercadoPagoPaymentService: GetMercadoPagoPaymentService,
    private readonly normalizeMercadoPagoWebhookService: NormalizeMercadoPagoWebhookService,

    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveMercadoPagoWebhookDtoIn,
  ): Promise<ReceiveMercadoPagoWebhookDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const paymentId = this.resolvePaymentId({
        payload: dtoIn.payload,
        queryParams: dtoIn.queryParams,
      });

      await this.validateMercadoPagoWebhookService.exec(
        new ValidateMercadoPagoWebhookDtoIn({
          xSignature: dtoIn.xSignature,
          xRequestId: dtoIn.xRequestId,
          dataId: this.resolveSignatureDataId(dtoIn.queryParams),
          webhookSecret: credentialData.webhookSecret,
        }),
      );

      const paymentDtoOut = await this.getMercadoPagoPaymentService.exec(
        new GetMercadoPagoPaymentDtoIn({
          paymentId,
          accessToken: credentialData.accessToken,
        }),
      );

      const normalizedDtoOut = this.normalizeMercadoPagoWebhookService.exec(
        new NormalizeMercadoPagoWebhookDtoIn({
          payload: dtoIn.payload,
          payment: paymentDtoOut.payment,
          headers: dtoIn.headers,
          queryParams: dtoIn.queryParams,
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
            payload: {
              notification: dtoIn.payload,
              payment: paymentDtoOut.payment,
              providerResponse: paymentDtoOut.providerResponse,
            },
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
              source: 'ReceiveMercadoPagoWebhookUseCase',
              apiCredentialId: dtoIn.apiCredentialId,
              mercadoPagoPaymentId: paymentId,
            },
            config: null,
          }),
        );

      if (registeredDtoOut.wasAlreadyRegistered) {
        return new ReceiveMercadoPagoWebhookDtoOut(
          registeredDtoOut.paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'mercado pago webhook event already registered',
            paymentId,
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

      return new ReceiveMercadoPagoWebhookDtoOut(
        processedDtoOut.paymentWebhookEvent,
        processedDtoOut.paymentTransaction,
        processedDtoOut.processingResult,
        false,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceiveMercadoPagoWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
            payload: dtoIn.payload,
            queryParams: dtoIn.queryParams,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive mercado pago webhook use case';

      throw new Error(message);
    }
  }

  private async resolveCredentialData(apiCredentialId: string): Promise<{
    accessToken: string;
    webhookSecret: string;
  }> {
    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(apiCredentialId),
      );

    const apiCredential = apiCredentialDtoOut.apiCredential;

    if (apiCredential.status !== 'active') {
      throw new Error('api credential is not active');
    }

    const normalizedCredentialProvider = this.normalizeProvider(
      apiCredential.provider,
    );

    if (normalizedCredentialProvider !== 'mercado_pago') {
      throw new Error('api credential provider must be mercado_pago');
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

    const decryptedConfigDtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: apiCredential.config,
        },
        keysToDecrypt: [
          'webhookSecret',
          'webhook_secret',
          'secret',
          'accessToken',
          'access_token',
        ],
        strict: false,
      }),
    );

    const tokenConfig = this.toRecordOrNull(
      decryptedTokenDtoOut.apiCredential.config,
    );

    const config = this.toRecordOrNull(
      decryptedConfigDtoOut.apiCredential.config,
    );

    const accessToken =
      this.extractString(tokenConfig, 'token') ??
      this.extractString(config, 'accessToken') ??
      this.extractString(config, 'access_token');

    const webhookSecret =
      this.extractString(config, 'webhookSecret') ??
      this.extractString(config, 'webhook_secret') ??
      this.extractString(config, 'secret');

    if (accessToken === null) {
      throw new Error('Mercado Pago access token is required');
    }

    if (webhookSecret === null) {
      throw new Error(
        'Mercado Pago webhookSecret is required in api credential config',
      );
    }

    return {
      accessToken,
      webhookSecret,
    };
  }

  private resolvePaymentId(params: {
    payload: Record<string, unknown>;
    queryParams: Record<string, unknown>;
  }): string {
    const queryDataId = this.extractString(params.queryParams, 'data.id');
    const queryId = this.extractString(params.queryParams, 'id');

    if (queryDataId !== null) {
      return queryDataId;
    }

    if (queryId !== null) {
      return queryId;
    }

    const queryData = this.extractObject(params.queryParams, 'data');
    const queryDataObjectId = this.extractString(queryData, 'id');

    if (queryDataObjectId !== null) {
      return queryDataObjectId;
    }

    const bodyData = this.extractObject(params.payload, 'data');
    const bodyDataId = this.extractString(bodyData, 'id');

    if (bodyDataId !== null) {
      return bodyDataId;
    }

    throw new Error('Mercado Pago payment id was not found in webhook');
  }

  private extractObject(
    object: Record<string, unknown> | null,
    key: string,
  ): Record<string, unknown> | null {
    if (object === null) {
      return null;
    }

    const value = object[key];

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

  private resolveSignatureDataId(
    queryParams: Record<string, unknown>,
  ): string | null {
    const direct =
      this.extractString(queryParams, 'data.id') ??
      this.extractString(queryParams, 'id');

    if (direct !== null) {
      return direct;
    }

    const data = this.extractObject(queryParams, 'data');

    return this.extractString(data, 'id');
  }

  private normalizeProvider(provider: unknown): string {
    const value = String(provider ?? '').trim().toLowerCase();

    if (['mercadopago', 'mercado-pago', 'mercado_pago'].includes(value)) {
      return 'mercado_pago';
    }

    return value;
  }

  private toRecordOrNull(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }
}
