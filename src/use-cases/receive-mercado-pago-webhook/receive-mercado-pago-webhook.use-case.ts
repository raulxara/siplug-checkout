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

import { NormalizedPaymentWebhookEventDto } from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

import { ProcessSubscriptionWebhookEventDtoIn } from '../process-subscription-webhook-event/dtos/process-subscription-webhook-event.dto-in';
import { ProcessSubscriptionWebhookEventUseCase } from '../process-subscription-webhook-event/process-subscription-webhook-event.use-case';

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

    private readonly processSubscriptionWebhookEventUseCase: ProcessSubscriptionWebhookEventUseCase,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveMercadoPagoWebhookDtoIn,
  ): Promise<ReceiveMercadoPagoWebhookDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const resourceType = this.resolveResourceType({
        payload: dtoIn.payload,
        queryParams: dtoIn.queryParams,
      });

      const resourceId = this.resolveResourceId({
        payload: dtoIn.payload,
        queryParams: dtoIn.queryParams,
      });

      if (this.shouldValidateMercadoPagoSignature(dtoIn)) {
        await this.validateMercadoPagoWebhookService.exec(
          new ValidateMercadoPagoWebhookDtoIn({
            xSignature: dtoIn.xSignature,
            xRequestId: dtoIn.xRequestId,
            dataId: this.resolveSignatureDataId(dtoIn.queryParams),
            webhookSecret: credentialData.webhookSecret,
          }),
        );
      }

      const mercadoPagoResource = await this.resolveMercadoPagoResource({
        resourceType,
        resourceId,
        accessToken: credentialData.accessToken,
        baseUrl: credentialData.baseUrl,
      });

      const normalizedDtoOut = this.normalizeMercadoPagoWebhookService.exec(
        new NormalizeMercadoPagoWebhookDtoIn({
          payload: dtoIn.payload,
          payment: mercadoPagoResource.payment,
          preapproval: mercadoPagoResource.preapproval,
          headers: dtoIn.headers,
          queryParams: dtoIn.queryParams,
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
            payload: {
              notification: dtoIn.payload,
              payment: mercadoPagoResource.payment,
              preapproval: mercadoPagoResource.preapproval,
              providerResponse: mercadoPagoResource.providerResponse,
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
              mercadoPagoResourceType: resourceType,
              mercadoPagoResourceId: resourceId,
            },
            config: null,
          }),
        );

      if (
        registeredDtoOut.wasAlreadyRegistered &&
        String(registeredDtoOut.paymentWebhookEvent.status) === 'processed'
      ) {
        return new ReceiveMercadoPagoWebhookDtoOut(
          registeredDtoOut.paymentWebhookEvent,
          null,
          {
            ignored: true,
            reason: 'mercado pago webhook event already processed',
            resourceType,
            resourceId,
          },
          true,
        );
      }

      const paymentWebhookEventId = String(
        registeredDtoOut.paymentWebhookEvent._id,
      ).trim();

      if (paymentWebhookEventId === '') {
        throw new Error('paymentWebhookEvent._id is required');
      }

      const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(
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

      return new ReceiveMercadoPagoWebhookDtoOut(
        subscriptionProcessedDtoOut.paymentWebhookEvent,
        subscriptionProcessedDtoOut.paymentTransaction ??
          processedDtoOut.paymentTransaction,
        {
          paymentProcessingResult: processedDtoOut.processingResult,
          subscriptionProcessingResult:
            subscriptionProcessedDtoOut.processingResult,
        },
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

  private shouldValidateMercadoPagoSignature(
    dtoIn: ReceiveMercadoPagoWebhookDtoIn,
  ): boolean {
    if (dtoIn.devSkipSignature !== true) {
      return true;
    }

    const appEnv = String(
      process.env.APP_ENV ?? process.env.NODE_ENV ?? '',
    )
      .trim()
      .toLowerCase();

    const isLocalEnvironment = ['local', 'development', 'dev', 'test'].includes(
      appEnv,
    );

    return !isLocalEnvironment;
  }

  private resolveResourceType(params: {
    payload: Record<string, unknown>;
    queryParams: Record<string, unknown>;
  }): 'payment' | 'preapproval' {
    const type =
      this.extractString(params.payload, 'type') ??
      this.extractString(params.queryParams, 'type') ??
      this.extractString(params.queryParams, 'topic') ??
      this.extractString(params.payload, 'topic');

    const normalized = String(type ?? 'payment')
      .trim()
      .toLowerCase()
      .replace(/-/g, '_');

    if (
      normalized === 'preapproval' ||
      normalized === 'subscription_preapproval' ||
      normalized === 'authorized_payment'
    ) {
      return 'preapproval';
    }

    return 'payment';
  }

  private resolveResourceId(params: {
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

    throw new Error('Mercado Pago resource id was not found in webhook');
  }

  private async resolveMercadoPagoResource(params: {
    resourceType: 'payment' | 'preapproval';
    resourceId: string;
    accessToken: string;
    baseUrl: string;
  }): Promise<{
    payment: Record<string, unknown> | null;
    preapproval: Record<string, unknown> | null;
    providerResponse: Record<string, unknown>;
  }> {
    if (params.resourceType === 'payment') {
      const paymentDtoOut = await this.getMercadoPagoPaymentService.exec(
        new GetMercadoPagoPaymentDtoIn({
          paymentId: params.resourceId,
          accessToken: params.accessToken,
        }),
      );

      return {
        payment: paymentDtoOut.payment,
        preapproval: null,
        providerResponse: paymentDtoOut.providerResponse,
      };
    }

    const response = await fetch(
      `${params.baseUrl}/preapproval/${encodeURIComponent(params.resourceId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const responseText = await response.text();
    const responseBody = this.parseJson(responseText);

    if (!response.ok) {
      throw new Error(
        `Mercado Pago get preapproval failed with status ${response.status}`,
      );
    }

    if (responseBody === null) {
      throw new Error('Mercado Pago preapproval response is invalid');
    }

    return {
      payment: null,
      preapproval: responseBody,
      providerResponse: {
        statusCode: response.status,
        ok: response.ok,
        body: responseBody,
      },
    };
  }

  private async enrichNormalizedEventWithPaymentTransactionData(
    event: NormalizedPaymentWebhookEventDto,
  ): Promise<NormalizedPaymentWebhookEventDto> {
    const paymentTransaction =
      await this.resolvePaymentTransactionFromEvent(event);

    if (paymentTransaction === null) {
      return event;
    }

    const paymentTransactionRecord = paymentTransaction as unknown as Record<
      string,
      unknown
    >;

    const metadata = this.toRecordOrNull(paymentTransactionRecord.metadata);
    const config = this.toRecordOrNull(paymentTransactionRecord.config);

    const paymentTransactionId =
      event.paymentTransactionId ??
      this.toNullableString(paymentTransaction._id);

    const checkoutSessionId =
      event.checkoutSessionId ??
      this.toNullableString(paymentTransaction.checkoutSessionId);

    const subscriptionId =
      event.subscriptionId ??
      this.extractString(metadata, 'subscriptionId') ??
      this.extractString(metadata, 'subscription_id') ??
      this.extractString(config, 'subscriptionId') ??
      this.extractString(config, 'subscription_id');

    const subscriptionInvoiceId =
      event.subscriptionInvoiceId ??
      this.extractString(metadata, 'subscriptionInvoiceId') ??
      this.extractString(metadata, 'subscription_invoice_id') ??
      this.extractString(config, 'subscriptionInvoiceId') ??
      this.extractString(config, 'subscription_invoice_id');

    const gatewaySubscriptionId =
      event.gatewaySubscriptionId ??
      this.extractString(metadata, 'gatewaySubscriptionId') ??
      this.extractString(metadata, 'gateway_subscription_id') ??
      this.extractString(config, 'gatewaySubscriptionId') ??
      this.extractString(config, 'gateway_subscription_id');

    const gatewayInvoiceId =
      event.gatewayInvoiceId ??
      this.extractString(metadata, 'gatewayInvoiceId') ??
      this.extractString(metadata, 'gateway_invoice_id') ??
      this.extractString(config, 'gatewayInvoiceId') ??
      this.extractString(config, 'gateway_invoice_id');

    return new NormalizedPaymentWebhookEventDto({
      provider: event.provider,
      eventId: event.eventId,
      eventType: event.eventType,
      eventAction: event.eventAction,
      canonicalStatus: event.canonicalStatus,

      gatewayTransactionId: event.gatewayTransactionId,
      gatewayPaymentIntentId: event.gatewayPaymentIntentId,
      gatewayChargeId: event.gatewayChargeId,
      gatewaySubscriptionId,
      gatewayInvoiceId,

      paymentTransactionId,
      checkoutSessionId,
      subscriptionId,
      subscriptionInvoiceId,
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
      event.gatewaySubscriptionId,
      event.gatewayInvoiceId,
    ].filter((value): value is string => value !== null);

    for (const gatewayTransactionId of gatewayTransactionIds) {
      const found =
        await this.findPaymentTransactionByGatewayTransactionIdSafe(
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

  private parseJson(value: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(value);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }

      return parsed as Record<string, unknown>;
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

  private async resolveCredentialData(apiCredentialId: string): Promise<{
    accessToken: string;
    webhookSecret: string;
    baseUrl: string;
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

    const baseUrl =
      this.extractString(config, 'baseUrl') ??
      this.extractString(config, 'base_url') ??
      'https://api.mercadopago.com';

    return {
      accessToken,
      webhookSecret,
      baseUrl: baseUrl.replace(/\/+$/, ''),
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
