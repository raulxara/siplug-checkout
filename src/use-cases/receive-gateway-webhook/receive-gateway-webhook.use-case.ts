import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';
import type { CheckoutSessionRow } from '../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ReceiveGatewayWebhookDtoIn } from './dtos/receive-gateway-webhook.dto-in';
import { ReceiveGatewayWebhookDtoOut } from './dtos/receive-gateway-webhook.dto-out';

@Injectable()
export class ReceiveGatewayWebhookUseCase {
  constructor(
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,

    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,
    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveGatewayWebhookDtoIn,
  ): Promise<ReceiveGatewayWebhookDtoOut> {
    try {
      const normalizedProvider = this.normalize(dtoIn.gatewayProvider);

       if (normalizedProvider === 'stripe') {
        return await this.handleStripeWebhook(dtoIn);
      }

      if (normalizedProvider === 'mercado_pago') {
        return new ReceiveGatewayWebhookDtoOut(
          'mercado_pago.webhook_not_implemented',
          false,
          null,
          null,
        );
      }

      if (normalizedProvider === 'infinitypay') {
        return new ReceiveGatewayWebhookDtoOut(
          'infinitypay.webhook_not_implemented',
          false,
          null,
          null,
        );
      }

      if (normalizedProvider === 'pagseguro') {
        return new ReceiveGatewayWebhookDtoOut(
          'pagseguro.webhook_not_implemented',
          false,
          null,
          null,
        );
      }
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceiveGatewayWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            gatewayProvider: dtoIn.gatewayProvider,
            hasRawBody: dtoIn.rawBody !== null,
            eventType: this.toNullableString(dtoIn.payload.type),
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on receive gateway webhook use case';

      throw new Error(message);
    }
  }

  private async handleStripeWebhook(
    dtoIn: ReceiveGatewayWebhookDtoIn,
  ): Promise<ReceiveGatewayWebhookDtoOut> {
    const eventPayload = dtoIn.payload;
    const eventType = this.toNullableString(eventPayload.type) ?? 'unknown';

    const stripeObject = this.extractStripeObject(eventPayload);
    const stripeObjectId = this.toNullableString(stripeObject.id);

    const paymentTransactionIdFromMetadata =
      this.extractStripePaymentTransactionIdFromMetadata(stripeObject);

    const paymentTransaction =
      await this.resolvePaymentTransactionForStripeWebhook({
        stripeObjectId,
        paymentTransactionIdFromMetadata,
      });

    if (paymentTransaction === null) {
      throw new Error('payment transaction not found for stripe webhook');
    }

    if (paymentTransaction.apiCredentialId === null) {
      throw new Error('payment transaction api credential id is required');
    }

    const apiCredentialDtoOut =
      await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(
          paymentTransaction.apiCredentialId,
        ),
      );

    const webhookSecret = this.resolveWebhookSecret(
      apiCredentialDtoOut.apiCredential.config,
    );

    this.verifyStripeSignature({
      rawBody: dtoIn.rawBody,
      signatureHeader: this.getHeader(dtoIn.headers, 'stripe-signature'),
      webhookSecret,
    });

    const mappedStatus = this.mapStripeEventToInternalStatus({
      eventType,
      stripeObject,
    });

    if (mappedStatus === null) {
      return new ReceiveGatewayWebhookDtoOut(
        eventType,
        false,
        paymentTransaction,
        null,
      );
    }

    const now = this.nowAsSqlDateTime();

    const updatedPaymentTransactionDtoOut =
      await this.updatePaymentTransactionService.exec(
        new UpdatePaymentTransactionDtoIn({
          _id: paymentTransaction._id,

          gatewayStatus: mappedStatus.gatewayStatus,
          status: mappedStatus.status,
          processStatus: mappedStatus.processStatus,
          processMessage: mappedStatus.processMessage,

          providerResponse: eventPayload,
          gatewayResponse: {
            provider: 'stripe',
            eventType,
            eventId: this.toNullableString(eventPayload.id),
            objectId: stripeObjectId,
            verified: true,
            receivedAt: now,
          },

          paidAt:
            mappedStatus.status === 'paid' ? now : paymentTransaction.paidAt,
          failedAt:
            mappedStatus.status === 'failed'
              ? now
              : paymentTransaction.failedAt,
          canceledAt:
            mappedStatus.status === 'canceled'
              ? now
              : paymentTransaction.canceledAt,

          source: 'ReceiveGatewayWebhookUseCase.stripe',
        }),
      );

    let updatedCheckoutSession: CheckoutSessionRow | null = null;

    if (paymentTransaction.checkoutSessionId !== null) {
      const updatedCheckoutSessionDtoOut =
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionDtoIn({
            _id: paymentTransaction.checkoutSessionId,
            status: this.resolveCheckoutSessionStatus(mappedStatus.status),
            source: 'ReceiveGatewayWebhookUseCase.stripe',
          }),
        );

      updatedCheckoutSession = updatedCheckoutSessionDtoOut.checkoutSession;
    }

    return new ReceiveGatewayWebhookDtoOut(
      eventType,
      true,
      updatedPaymentTransactionDtoOut.paymentTransaction,
      updatedCheckoutSession,
    );
}

  private async resolvePaymentTransactionForStripeWebhook(params: {
    stripeObjectId: string | null;
    paymentTransactionIdFromMetadata: string | null;
  }): Promise<PaymentTransactionRow | null> {
    if (params.stripeObjectId !== null) {
      const byGatewayTransactionId =
        await this.tryFindPaymentTransactionByGatewayTransactionId(
          params.stripeObjectId,
        );

      if (byGatewayTransactionId !== null) {
        return byGatewayTransactionId;
      }
    }

    if (params.paymentTransactionIdFromMetadata !== null) {
      const byUniqueId = await this.tryFindPaymentTransactionByUniqueId(
        params.paymentTransactionIdFromMetadata,
      );

      if (byUniqueId !== null) {
        return byUniqueId;
      }
    }

    return null;
  }

  private async tryFindPaymentTransactionByGatewayTransactionId(
    gatewayTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
          new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
          ),
        );

      return dtoOut.paymentTransaction;
    } catch {
      return null;
    }
  }

  private async tryFindPaymentTransactionByUniqueId(
    paymentTransactionId: string,
  ): Promise<PaymentTransactionRow | null> {
    try {
      const dtoOut = await this.findPaymentTransactionByUniqueIdService.exec(
        new FindPaymentTransactionByUniqueIdDtoIn(paymentTransactionId),
      );

      return dtoOut.paymentTransaction;
    } catch {
      return null;
    }
  }

  private verifyStripeSignature(params: {
    rawBody: Buffer | null;
    signatureHeader: string | null;
    webhookSecret: string;
  }): void {
    if (params.rawBody === null) {
      throw new Error('stripe webhook raw body is required');
    }

    if (params.signatureHeader === null) {
      throw new Error('stripe signature header is required');
    }

    const parsedSignature = this.parseStripeSignatureHeader(
      params.signatureHeader,
    );

    const signedPayload = `${parsedSignature.timestamp}.${params.rawBody.toString(
      'utf8',
    )}`;

    const expectedSignature = createHmac('sha256', params.webhookSecret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const signatureMatches = parsedSignature.signatures.some((signature) =>
      this.safeCompareHex(signature, expectedSignature),
    );

    if (!signatureMatches) {
      throw new Error('invalid stripe webhook signature');
    }
  }

  private parseStripeSignatureHeader(signatureHeader: string): {
    timestamp: string;
    signatures: string[];
  } {
    const parts = signatureHeader.split(',');

    const timestamp = parts
      .map((part) => part.trim())
      .find((part) => part.startsWith('t='))
      ?.replace('t=', '');

    const signatures = parts
      .map((part) => part.trim())
      .filter((part) => part.startsWith('v1='))
      .map((part) => part.replace('v1=', ''));

    if (!timestamp || signatures.length === 0) {
      throw new Error('invalid stripe signature header format');
    }

    return {
      timestamp,
      signatures,
    };
  }

  private safeCompareHex(a: string, b: string): boolean {
    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  }

  private resolveWebhookSecret(config: Record<string, unknown> | null): string {
    if (config === null) {
      throw new Error('api credential config is required');
    }

    const webhookSecret =
      this.toNullableString(config.webhookSecret) ??
      this.toNullableString(config.webhook_secret) ??
      this.toNullableString(config.stripeWebhookSecret) ??
      this.toNullableString(config.stripe_webhook_secret);

    if (webhookSecret === null) {
      throw new Error('stripe webhook secret is required in api credential config');
    }

    return webhookSecret;
  }

  private extractStripeObject(
    eventPayload: Record<string, unknown>,
  ): Record<string, unknown> {
    const data = this.asObject(eventPayload.data);
    return this.asObject(data.object);
  }

  private extractStripePaymentTransactionIdFromMetadata(
    stripeObject: Record<string, unknown>,
  ): string | null {
    const metadata = this.asObject(stripeObject.metadata);

    return (
      this.toNullableString(metadata.paymentTransactionId) ??
      this.toNullableString(metadata.payment_transaction_id)
    );
  }

  private mapStripeEventToInternalStatus(params: {
    eventType: string;
    stripeObject: Record<string, unknown>;
  }): {
    gatewayStatus: string;
    status: string;
    processStatus: string;
    processMessage: string;
  } | null {
    const paymentStatus =
      this.toNullableString(params.stripeObject.payment_status) ??
      this.toNullableString(params.stripeObject.status) ??
      params.eventType;

    if (
      params.eventType === 'checkout.session.completed' ||
      params.eventType === 'checkout.session.async_payment_succeeded' ||
      params.eventType === 'payment_intent.succeeded'
    ) {
      return {
        gatewayStatus: paymentStatus,
        status: 'paid',
        processStatus: 'gateway_approved',
        processMessage: `Stripe webhook ${params.eventType} confirmed payment`,
      };
    }

    if (
      params.eventType === 'checkout.session.async_payment_failed' ||
      params.eventType === 'payment_intent.payment_failed'
    ) {
      return {
        gatewayStatus: paymentStatus,
        status: 'failed',
        processStatus: 'gateway_rejected',
        processMessage: `Stripe webhook ${params.eventType} failed payment`,
      };
    }

    if (params.eventType === 'checkout.session.expired') {
      return {
        gatewayStatus: paymentStatus,
        status: 'canceled',
        processStatus: 'gateway_cancelled',
        processMessage: 'Stripe checkout session expired',
      };
    }

    return null;
  }

  private resolveCheckoutSessionStatus(paymentTransactionStatus: string): string {
    if (paymentTransactionStatus === 'paid') {
      return 'paid';
    }

    if (paymentTransactionStatus === 'failed') {
      return 'failed';
    }

    if (paymentTransactionStatus === 'canceled') {
      return 'canceled';
    }

    return 'processing';
  }

  private getHeader(
    headers: Record<string, string | string[] | undefined>,
    key: string,
  ): string | null {
    const normalizedKey = key.toLowerCase();

    const headerValue = Object.entries(headers).find(
      ([headerKey]) => headerKey.toLowerCase() === normalizedKey,
    )?.[1];

    if (Array.isArray(headerValue)) {
      return headerValue[0] ?? null;
    }

    return this.toNullableString(headerValue);
  }

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
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

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }

  private nowAsSqlDateTime(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}