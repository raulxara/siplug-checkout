import { Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import {
  NormalizedPaymentWebhookEventDto,
  type PaymentWebhookCanonicalStatus,
} from '../../modules/payment-webhook-events/dtos/normalized-payment-webhook-event.dto';
import { RegisterPaymentWebhookEventDtoIn } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';

import { ProcessPaymentWebhookEventDtoIn } from '../process-payment-webhook-event/dtos/process-payment-webhook-event.dto-in';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';

import { CapturePayPalOrderReturnDtoIn } from './dtos/capture-paypal-order-return.dto-in';
import { CapturePayPalOrderReturnDtoOut } from './dtos/capture-paypal-order-return.dto-out';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';

type PayPalCredentialData = {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
};

type PayPalOAuthResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
  message?: string;
  [key: string]: unknown;
};

@Injectable()
export class CapturePayPalOrderReturnUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,
    private readonly registerPaymentWebhookEventService: RegisterPaymentWebhookEventService,
    private readonly processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,
  ) {}

  async exec(
    dtoIn: CapturePayPalOrderReturnDtoIn,
  ): Promise<CapturePayPalOrderReturnDtoOut> {
    try {
      const credentialData = await this.resolveCredentialData(
        dtoIn.apiCredentialId,
      );

      const accessToken = await this.createAccessToken(credentialData);

      const captureResponse = await fetch(
        `${credentialData.baseUrl}/v2/checkout/orders/${dtoIn.orderId}/capture`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

      const captureBody = await this.parseJsonResponse(captureResponse);

      if (!captureResponse.ok) {
        throw new Error(
          this.extractPayPalErrorMessage(captureBody) ??
            `PayPal capture order request failed with status ${captureResponse.status}`,
        );
      }

      const normalizedEvent = this.buildNormalizedCaptureEvent({
        apiCredentialId: dtoIn.apiCredentialId,
        orderId: dtoIn.orderId,
        captureBody,
      });

      return await this.registerAndProcessNormalizedEvent({
        normalizedEvent,
        metadata: {
          source: 'CapturePayPalOrderReturnUseCase',
          apiCredentialId: dtoIn.apiCredentialId,
          orderId: dtoIn.orderId,
        },
        providerResponse: captureBody,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'CapturePayPalOrderReturnUseCase',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
            orderId: dtoIn.orderId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on capture paypal order return use case';

      throw new Error(message);
    }
  }

  async execCancel(
    dtoIn: CapturePayPalOrderReturnDtoIn,
  ): Promise<CapturePayPalOrderReturnDtoOut> {
    try {
      const normalizedEvent = new NormalizedPaymentWebhookEventDto({
        provider: 'paypal',
        eventId: `paypal-return-cancel:${dtoIn.orderId}`,
        eventType: 'CHECKOUT.ORDER.CANCELLED.RETURN',
        eventAction: 'checkout.order.canceled',
        canonicalStatus: 'canceled',

        gatewayTransactionId: dtoIn.orderId,
        gatewayPaymentIntentId: dtoIn.orderId,
        gatewayChargeId: null,
        gatewaySubscriptionId: null,
        gatewayInvoiceId: null,

        paymentTransactionId: null,
        checkoutSessionId: null,
        subscriptionId: null,
        subscriptionInvoiceId: null,

        externalReference: dtoIn.orderId,
        amount: null,
        currency: null,

        rawPayload: {
          source: 'paypal-return-cancel',
          orderId: dtoIn.orderId,
        },
        headers: {
          source: 'paypal-return-cancel',
        },
      });

      return await this.registerAndProcessNormalizedEvent({
        normalizedEvent,
        metadata: {
          source: 'CapturePayPalOrderReturnUseCase.cancel',
          apiCredentialId: dtoIn.apiCredentialId,
          orderId: dtoIn.orderId,
        },
        providerResponse: null,
      });
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'CapturePayPalOrderReturnUseCase.execCancel',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
            orderId: dtoIn.orderId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on cancel paypal order return use case';

      throw new Error(message);
    }
  }

  private async registerAndProcessNormalizedEvent(params: {
    normalizedEvent: NormalizedPaymentWebhookEventDto;
    metadata: Record<string, unknown>;
    providerResponse: Record<string, unknown> | null;
  }): Promise<CapturePayPalOrderReturnDtoOut> {
    const normalizedEvent =
    await this.enrichNormalizedEventWithPaymentTransactionData(
        params.normalizedEvent,
    );

    const registeredDtoOut = await this.registerPaymentWebhookEventService.exec(
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
        normalizedPayload: this.buildNormalizedPayload(normalizedEvent),

        metadata: params.metadata,
        config: null,
      }),
    );

    const paymentWebhookEvent =
      registeredDtoOut.paymentWebhookEvent as Record<string, unknown>;

    if (
      registeredDtoOut.wasAlreadyRegistered &&
      String(paymentWebhookEvent.status) === 'processed'
    ) {
      return new CapturePayPalOrderReturnDtoOut(
        paymentWebhookEvent,
        null,
        {
          ignored: true,
          reason: 'paypal return event already processed',
          provider: normalizedEvent.provider,
          eventId: normalizedEvent.eventId,
        },
        params.providerResponse,
        true,
      );
    }

    const paymentWebhookEventId = String(paymentWebhookEvent._id ?? '').trim();

    if (paymentWebhookEventId === '') {
      throw new Error('paymentWebhookEvent._id is required');
    }

    const processedDtoOut = await this.processPaymentWebhookEventUseCase.exec(
      new ProcessPaymentWebhookEventDtoIn({
        paymentWebhookEventId,
        normalizedEvent,
      }),
    );

    return new CapturePayPalOrderReturnDtoOut(
      processedDtoOut.paymentWebhookEvent,
      processedDtoOut.paymentTransaction,
      processedDtoOut.processingResult,
      params.providerResponse,
      registeredDtoOut.wasAlreadyRegistered,
    );
  }

  private buildNormalizedCaptureEvent(params: {
    apiCredentialId: string;
    orderId: string;
    captureBody: Record<string, unknown>;
  }): NormalizedPaymentWebhookEventDto {
    const capture = this.extractFirstCapture(params.captureBody);

    const captureId =
      this.extractString(capture, 'id') ??
      this.extractString(params.captureBody, 'id');

    const status =
      this.extractString(capture, 'status') ??
      this.extractString(params.captureBody, 'status') ??
      'COMPLETED';

    const amountObject = this.toRecordOrNull(capture?.amount);
    const amount = this.amountToCents(this.extractString(amountObject, 'value'));
    const currency =
      this.extractString(amountObject, 'currency_code') ?? 'BRL';

    const canonicalStatus = this.mapPayPalStatusToCanonicalStatus(status);

    return new NormalizedPaymentWebhookEventDto({
      provider: 'paypal',
      eventId: `paypal-return-capture:${params.orderId}:${captureId ?? 'unknown'}:${status}`,
      eventType: 'PAYMENT.CAPTURE.RETURN',
      eventAction: `payment.capture.${status.toLowerCase()}`,
      canonicalStatus,

      gatewayTransactionId: params.orderId,
      gatewayPaymentIntentId: params.orderId,
      gatewayChargeId: captureId,
      gatewaySubscriptionId: null,
      gatewayInvoiceId: null,

      paymentTransactionId: this.extractPaymentTransactionIdFromCaptureBody(
        params.captureBody,
      ),
      checkoutSessionId: null,
      subscriptionId: null,
      subscriptionInvoiceId: null,

      externalReference:
        this.extractExternalReferenceFromCaptureBody(params.captureBody) ??
        params.orderId,

      amount,
      currency,

      rawPayload: {
        paypal: params.captureBody,
      },
      headers: {
        source: 'paypal-return-capture',
      },
    });
  }

  private extractFirstCapture(
    body: Record<string, unknown>,
  ): Record<string, unknown> | null {
    const purchaseUnits = body.purchase_units;

    if (!Array.isArray(purchaseUnits)) {
      return null;
    }

    for (const purchaseUnit of purchaseUnits) {
      const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);
      const payments = this.toRecordOrNull(purchaseUnitObject?.payments);
      const captures = payments?.captures;

      if (Array.isArray(captures) && captures.length > 0) {
        return this.toRecordOrNull(captures[0]);
      }
    }

    return null;
  }

  private extractPaymentTransactionIdFromCaptureBody(
    body: Record<string, unknown>,
  ): string | null {
    const purchaseUnits = body.purchase_units;

    if (!Array.isArray(purchaseUnits)) {
      return null;
    }

    for (const purchaseUnit of purchaseUnits) {
      const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);

      const customId = this.extractString(purchaseUnitObject, 'custom_id');

      if (customId !== null) {
        return customId;
      }
    }

    return null;
  }

  private extractExternalReferenceFromCaptureBody(
    body: Record<string, unknown>,
  ): string | null {
    const purchaseUnits = body.purchase_units;

    if (!Array.isArray(purchaseUnits)) {
      return null;
    }

    for (const purchaseUnit of purchaseUnits) {
      const purchaseUnitObject = this.toRecordOrNull(purchaseUnit);

      const invoiceId = this.extractString(purchaseUnitObject, 'invoice_id');
      const referenceId = this.extractString(purchaseUnitObject, 'reference_id');

      if (invoiceId !== null) {
        return invoiceId;
      }

      if (referenceId !== null) {
        return referenceId;
      }
    }

    return null;
  }

  private mapPayPalStatusToCanonicalStatus(
    status: string,
  ): PaymentWebhookCanonicalStatus {
    const normalized = status.toUpperCase().trim();

    if (normalized === 'COMPLETED' || normalized === 'APPROVED') {
      return 'paid';
    }

    if (normalized === 'PENDING') {
      return 'pending';
    }

    if (normalized === 'DENIED' || normalized === 'FAILED') {
      return 'failed';
    }

    if (
      normalized === 'VOIDED' ||
      normalized === 'CANCELLED' ||
      normalized === 'CANCELED'
    ) {
      return 'canceled';
    }

    if (
      normalized === 'REFUNDED' ||
      normalized === 'PARTIALLY_REFUNDED'
    ) {
      return 'refunded';
    }

    return 'ignored';
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

    return {
      clientId,
      clientSecret,
      baseUrl,
    };
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
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

  private async parseJsonResponse(
    response: Response,
  ): Promise<Record<string, unknown>> {
    const rawText = await response.text();

    if (rawText.trim() === '') {
      return {
        message: 'PayPal returned an empty response',
        statusCode: response.status,
      };
    }

    try {
      const parsed = JSON.parse(rawText) as unknown;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }

      return {
        message: 'PayPal returned a non object JSON response',
        rawResponse: rawText,
        statusCode: response.status,
      };
    } catch {
      return {
        message: 'PayPal returned a non JSON response',
        rawResponse: rawText.slice(0, 2000),
        statusCode: response.status,
      };
    }
  }

  private extractPayPalErrorMessage(
    body: Record<string, unknown>,
  ): string | null {
    if (body.details !== undefined) {
      return JSON.stringify(body.details);
    }

    return (
      this.extractString(body, 'message') ??
      this.extractString(body, 'name') ??
      this.extractString(body, 'error_description') ??
      this.extractString(body, 'error')
    );
  }

  private buildNormalizedPayload(
    event: NormalizedPaymentWebhookEventDto,
  ): Record<string, unknown> {
    return {
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

      paymentTransactionId: event.paymentTransactionId,
      checkoutSessionId: event.checkoutSessionId,
      subscriptionId: event.subscriptionId,
      subscriptionInvoiceId: event.subscriptionInvoiceId,
      externalReference: event.externalReference,

      amount: event.amount,
      currency: event.currency,
    };
  }

  private amountToCents(value: string | null): number | null {
    if (value === null) {
      return null;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return null;
    }

    return Math.round(numberValue * 100);
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
