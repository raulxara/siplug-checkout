import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { FetchMercadoPagoPaymentDtoIn } from '../../modules/gateway-orchestration/services/fetch-mercado-pago-payment/dtos/fetch-mercado-pago-payment.dto-in';
import { FetchMercadoPagoPaymentService } from '../../modules/gateway-orchestration/services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service';

import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ReceiveGatewayWebhookDtoIn } from './dtos/receive-gateway-webhook.dto-in';
import { ReceiveGatewayWebhookDtoOut } from './dtos/receive-gateway-webhook.dto-out';
import type { CheckoutSessionRow } from '../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

@Injectable()
export class ReceiveGatewayWebhookUseCase {
  constructor(
    private readonly findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly fetchMercadoPagoPaymentService: FetchMercadoPagoPaymentService,

    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ReceiveGatewayWebhookDtoIn,
  ): Promise<ReceiveGatewayWebhookDtoOut> {
    try {
      const provider = this.normalizeProvider(dtoIn.provider);

      if (!['mercado_pago', 'mercadopago', 'mercado-pago'].includes(provider)) {
        throw new Error('gateway webhook provider not supported');
      }

      const eventType = this.extractEventType(dtoIn);
      const eventAction = this.extractEventAction(dtoIn);

      if (eventType !== null && eventType !== 'payment') {
        return new ReceiveGatewayWebhookDtoOut(
          provider,
          eventType,
          eventAction,
          null,
          true,
          null,
          null,
        );
      }

      const gatewayTransactionId = this.extractGatewayTransactionId(dtoIn);

      if (gatewayTransactionId === null) {
        throw new Error('gateway transaction id not found in webhook payload');
      }

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByGatewayTransactionIdService.exec(
          new FindPaymentTransactionByGatewayTransactionIdDtoIn(
            gatewayTransactionId,
          ),
        );

      const paymentTransaction =
        paymentTransactionDtoOut.paymentTransaction;

      if (paymentTransaction.apiCredentialId === null) {
        throw new Error('payment transaction api credential is required');
      }

      const apiCredentialDtoOut =
        await this.findApiCredentialByUniqueIdService.exec(
          new FindApiCredentialByUniqueIdDtoIn(
            paymentTransaction.apiCredentialId,
          ),
        );

      const apiCredential = apiCredentialDtoOut.apiCredential;

      const webhookSecret = this.resolveWebhookSecret(apiCredential.config);

      if (webhookSecret !== null) {
        this.validateMercadoPagoSignature({
          dtoIn,
          secret: webhookSecret,
          gatewayTransactionId,
        });
      }

      if (apiCredential.token === null || apiCredential.token.trim() === '') {
        throw new Error('api credential token is required');
      }

      const providerToken = this.decryptProviderToken(apiCredential.token);

      const fetchedPaymentDtoOut =
        await this.fetchMercadoPagoPaymentService.exec(
          new FetchMercadoPagoPaymentDtoIn({
            accessToken: providerToken,
            paymentId: gatewayTransactionId,
          }),
        );

      const updatedPaymentTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,

            gatewayTransactionId:
              fetchedPaymentDtoOut.gatewayTransactionId ??
              paymentTransaction.gatewayTransactionId,

            gatewayStatus: fetchedPaymentDtoOut.gatewayStatus,

            status: fetchedPaymentDtoOut.status,
            processStatus: fetchedPaymentDtoOut.processStatus,
            processMessage: fetchedPaymentDtoOut.processMessage,

            providerResponse: fetchedPaymentDtoOut.providerResponse,
            gatewayResponse: {
              ...fetchedPaymentDtoOut.gatewayResponse,
              webhook: {
                provider,
                eventType,
                eventAction,
                receivedBody: dtoIn.body,
                receivedQuery: dtoIn.query,
              },
            },

            qrCode: fetchedPaymentDtoOut.qrCode,
            qrCodeBase64: fetchedPaymentDtoOut.qrCodeBase64,
            checkoutUrl: fetchedPaymentDtoOut.checkoutUrl,

            paidAt: fetchedPaymentDtoOut.paidAt,
            authorizedAt: fetchedPaymentDtoOut.authorizedAt,
            canceledAt: fetchedPaymentDtoOut.canceledAt,
            failedAt: fetchedPaymentDtoOut.failedAt,
            refundedAt: fetchedPaymentDtoOut.refundedAt,
            expiresAt: fetchedPaymentDtoOut.expiresAt,

            source: 'ReceiveGatewayWebhookUseCase',
          }),
        );

      let updatedCheckoutSession: CheckoutSessionRow | null = null;

      if (paymentTransaction.checkoutSessionId !== null) {
        const checkoutStatus = this.resolveCheckoutSessionStatus(
          fetchedPaymentDtoOut.status,
        );

        const updatedCheckoutSessionDtoOut =
          await this.updateCheckoutSessionService.exec(
            new UpdateCheckoutSessionDtoIn({
              _id: paymentTransaction.checkoutSessionId,
              status: checkoutStatus,
              source: 'ReceiveGatewayWebhookUseCase',
            }),
          );

        updatedCheckoutSession =
          updatedCheckoutSessionDtoOut.checkoutSession;
      }

      return new ReceiveGatewayWebhookDtoOut(
        provider,
        eventType,
        eventAction,
        gatewayTransactionId,
        false,
        updatedPaymentTransactionDtoOut.paymentTransaction,
        updatedCheckoutSession,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ReceiveGatewayWebhookUseCase',
          error,
          appFile: __filename,
          context: {
            provider: dtoIn.provider,
            eventType: this.extractEventType(dtoIn),
            eventAction: this.extractEventAction(dtoIn),
            gatewayTransactionId: this.extractGatewayTransactionId(dtoIn),
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

  private extractGatewayTransactionId(
    dtoIn: ReceiveGatewayWebhookDtoIn,
  ): string | null {
    const bodyData = this.asObject(dtoIn.body.data);

    const directId =
      this.toNullableString(bodyData.id) ??
      this.toNullableString(dtoIn.body.id) ??
      this.toNullableString(dtoIn.query['data.id']) ??
      this.toNullableString(dtoIn.query.id);

    if (directId !== null) {
      return directId;
    }

    const resource =
      this.toNullableString(dtoIn.body.resource) ??
      this.toNullableString(dtoIn.query.resource);

    if (resource !== null) {
      const parts = resource.split('/').filter((part) => part.trim() !== '');
      const lastPart = parts[parts.length - 1];

      return lastPart ?? null;
    }

    return null;
  }

  private extractEventType(dtoIn: ReceiveGatewayWebhookDtoIn): string | null {
    return (
      this.toNullableString(dtoIn.body.type) ??
      this.toNullableString(dtoIn.query.type) ??
      this.toNullableString(dtoIn.query.topic)
    );
  }

  private extractEventAction(dtoIn: ReceiveGatewayWebhookDtoIn): string | null {
    return this.toNullableString(dtoIn.body.action);
  }

  private decryptProviderToken(encryptedToken: string): string {
    const dtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: {
            token: encryptedToken,
          },
        },
        keysToDecrypt: ['token'],
        encryptedPrefix: 'enc::',
        strict: true,
      }),
    );

    const config = dtoOut.apiCredential.config;

    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('decrypted api credential config is invalid');
    }

    const token = (config as Record<string, unknown>).token;

    if (typeof token !== 'string' || token.trim() === '') {
      throw new Error('decrypted api credential token is invalid');
    }

    return token;
  }

  private resolveWebhookSecret(
    config: Record<string, unknown> | null,
  ): string | null {
    if (config === null) {
      return null;
    }

    return (
      this.toNullableString(config.webhookSecret) ??
      this.toNullableString(config.webhook_secret) ??
      this.toNullableString(config.mercadoPagoWebhookSecret) ??
      this.toNullableString(config.mercado_pago_webhook_secret)
    );
  }

  private validateMercadoPagoSignature(params: {
    dtoIn: ReceiveGatewayWebhookDtoIn;
    secret: string;
    gatewayTransactionId: string;
  }): void {
    const signatureHeader = this.getHeader(params.dtoIn.headers, 'x-signature');
    const requestId = this.getHeader(params.dtoIn.headers, 'x-request-id');

    if (signatureHeader === null) {
      throw new Error('mercado pago webhook x-signature header is required');
    }

    const signatureParts = this.parseSignatureHeader(signatureHeader);
    const ts = signatureParts.ts;
    const v1 = signatureParts.v1;

    if (ts === null || v1 === null) {
      throw new Error('mercado pago webhook signature is invalid');
    }

    const manifestParts: string[] = [];

    const queryDataId =
      this.toNullableString(params.dtoIn.query['data.id']) ??
      this.toNullableString(params.dtoIn.query.id) ??
      params.gatewayTransactionId;

    if (queryDataId !== null) {
      manifestParts.push(`id:${queryDataId.toLowerCase()};`);
    }

    if (requestId !== null) {
      manifestParts.push(`request-id:${requestId};`);
    }

    manifestParts.push(`ts:${ts};`);

    const manifest = manifestParts.join('');

    const expectedSignature = createHmac('sha256', params.secret)
      .update(manifest)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedBuffer = Buffer.from(v1, 'hex');

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new Error('mercado pago webhook signature does not match');
    }
  }

  private parseSignatureHeader(signatureHeader: string): {
    ts: string | null;
    v1: string | null;
  } {
    const parts = signatureHeader.split(',');

    let ts: string | null = null;
    let v1: string | null = null;

    for (const part of parts) {
      const [key, value] = part.split('=');

      if (key?.trim() === 'ts') {
        ts = value?.trim() ?? null;
      }

      if (key?.trim() === 'v1') {
        v1 = value?.trim() ?? null;
      }
    }

    return { ts, v1 };
  }

  private resolveCheckoutSessionStatus(paymentStatus: string): string {
    if (paymentStatus === 'paid') {
      return 'paid';
    }

    if (paymentStatus === 'authorized') {
      return 'authorized';
    }

    if (paymentStatus === 'failed') {
      return 'failed';
    }

    if (paymentStatus === 'canceled') {
      return 'canceled';
    }

    if (paymentStatus === 'refunded') {
      return 'refunded';
    }

    return 'processing';
  }

  private getHeader(
    headers: Record<string, unknown>,
    name: string,
  ): string | null {
    const lowerName = name.toLowerCase();

    for (const [key, value] of Object.entries(headers)) {
      if (key.toLowerCase() === lowerName) {
        return this.toNullableString(value);
      }
    }

    return null;
  }

  private normalizeProvider(provider: string): string {
    return provider
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
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
}
