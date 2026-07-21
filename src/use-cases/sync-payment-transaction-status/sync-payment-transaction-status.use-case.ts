import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { GatewayPaymentStatusDtoIn } from '../../modules/gateway-orchestration/dtos/gateway-payment-status.dto-in';
import { ResolvePaymentGatewayCredentialDtoIn } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in';
import { ResolvePaymentGatewayCredentialService } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';
import { SyncGatewayPaymentStatusService } from '../../modules/gateway-orchestration/services/sync-gateway-payment-status/sync-gateway-payment-status.service';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { SyncPaymentTransactionStatusDtoIn } from './dtos/sync-payment-transaction-status.dto-in';
import { SyncPaymentTransactionStatusDtoOut } from './dtos/sync-payment-transaction-status.dto-out';

@Injectable()
export class SyncPaymentTransactionStatusUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,
    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,

    private readonly resolvePaymentGatewayCredentialService: ResolvePaymentGatewayCredentialService,
    private readonly syncGatewayPaymentStatusService: SyncGatewayPaymentStatusService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: SyncPaymentTransactionStatusDtoIn,
  ): Promise<SyncPaymentTransactionStatusDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'syncPaymentTransactionStatus',
          requiredEntity: 'payment_transactions',
        }),
      );

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByUniqueIdService.exec(
          new FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId),
        );

      const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;

      if (this.isFinalStatus(paymentTransaction.status) && !dtoIn.force) {
        return new SyncPaymentTransactionStatusDtoOut(
          paymentTransaction,
          null,
          false,
          'payment transaction already has a final status. Use force=true to sync again.',
        );
      }

      if (paymentTransaction.gatewayTransactionId === null) {
        throw new Error(
          'payment transaction gatewayTransactionId is required to sync status',
        );
      }

      const resolvedGatewayCredentialDtoOut =
        await this.resolvePaymentGatewayCredentialService.exec(
          new ResolvePaymentGatewayCredentialDtoIn({
            officeId: paymentTransaction.officeId,
            clientId: paymentTransaction.clientId,
            paymentType: paymentTransaction.paymentType,
            paymentMethod: paymentTransaction.paymentMethod,

            gatewayId: paymentTransaction.gatewayId,
            apiCredentialId: paymentTransaction.apiCredentialId,
          }),
        );

      const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
      const resolvedApiCredential =
        resolvedGatewayCredentialDtoOut.apiCredential;

      const gatewayStatusDtoOut =
        await this.syncGatewayPaymentStatusService.exec(
          new GatewayPaymentStatusDtoIn({
            gatewayProvider: resolvedGateway.provider,
            gatewaySlug: resolvedGateway.slug,
            paymentTransaction,
            apiCredential: {
              _id: resolvedApiCredential._id,
              slug: resolvedApiCredential.slug,
              gatewayId: resolvedApiCredential.gatewayId,
              token: resolvedGatewayCredentialDtoOut.decryptedProviderToken,
              config: resolvedApiCredential.config,
              connectionData: resolvedGatewayCredentialDtoOut.connectionData,
            },
            config: {
              gatewayConfig: resolvedGateway.config,
              transactionConfig: paymentTransaction.config,
              apiCredentialConfig: resolvedApiCredential.config,
            },
          }),
        );

      const updatedPaymentTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,

            gatewayTransactionId: gatewayStatusDtoOut.gatewayTransactionId,
            gatewayStatus: gatewayStatusDtoOut.gatewayStatus,

            status: gatewayStatusDtoOut.status,
            processStatus: gatewayStatusDtoOut.processStatus,
            processMessage: gatewayStatusDtoOut.processMessage,

            providerResponse: this.sanitizeSensitiveGatewayData(
              gatewayStatusDtoOut.providerResponse,
            ),
            gatewayResponse: this.sanitizeSensitiveGatewayData(
              gatewayStatusDtoOut.gatewayResponse,
            ),

            qrCode: gatewayStatusDtoOut.qrCode,
            qrCodeBase64: gatewayStatusDtoOut.qrCodeBase64,
            boletoUrl: gatewayStatusDtoOut.boletoUrl,
            checkoutUrl: gatewayStatusDtoOut.checkoutUrl,

            paidAt: gatewayStatusDtoOut.paidAt,
            authorizedAt: gatewayStatusDtoOut.authorizedAt,
            canceledAt: gatewayStatusDtoOut.canceledAt,
            failedAt: gatewayStatusDtoOut.failedAt,
            refundedAt: gatewayStatusDtoOut.refundedAt,
            expiresAt: gatewayStatusDtoOut.expiresAt,

            source: 'SyncPaymentTransactionStatusUseCase',
          }),
        );

      let checkoutSession: Record<string, unknown> | null = null;

      if (
        updatedPaymentTransactionDtoOut.paymentTransaction.checkoutSessionId !==
        null
      ) {
        const updatedCheckoutSessionDtoOut =
          await this.updateCheckoutSessionService.exec(
            new UpdateCheckoutSessionDtoIn({
              _id: updatedPaymentTransactionDtoOut.paymentTransaction
                .checkoutSessionId,
              status: this.resolveCheckoutSessionStatus(
                updatedPaymentTransactionDtoOut.paymentTransaction.status,
              ),
              source: 'SyncPaymentTransactionStatusUseCase',
            }),
          );

        checkoutSession =
          updatedCheckoutSessionDtoOut.checkoutSession as unknown as Record<
            string,
            unknown
          >;
      }

      return new SyncPaymentTransactionStatusDtoOut(
        updatedPaymentTransactionDtoOut.paymentTransaction,
        checkoutSession,
        gatewayStatusDtoOut.success,
        gatewayStatusDtoOut.processMessage,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'SyncPaymentTransactionStatusUseCase',
          error,
          appFile: __filename,
          context: {
            paymentTransactionId: dtoIn.paymentTransactionId,
            force: dtoIn.force,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on sync payment transaction status use case';

      throw new Error(message);
    }
  }

  private isFinalStatus(status: string): boolean {
    return ['paid', 'failed', 'canceled', 'refunded', 'expired'].includes(
      status,
    );
  }

  private resolveCheckoutSessionStatus(
    paymentTransactionStatus: string,
  ): string {
    if (paymentTransactionStatus === 'paid') {
      return 'paid';
    }

    if (paymentTransactionStatus === 'authorized') {
      return 'authorized';
    }

    if (paymentTransactionStatus === 'failed') {
      return 'failed';
    }

    if (paymentTransactionStatus === 'canceled') {
      return 'canceled';
    }

    if (paymentTransactionStatus === 'refunded') {
      return 'refunded';
    }

    if (paymentTransactionStatus === 'expired') {
      return 'expired';
    }

    return 'processing';
  }

  private sanitizeSensitiveGatewayData(
    data: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (data === null) {
      return null;
    }

    const sanitized = this.sanitizeUnknownGatewayValue(data);

    if (
      !sanitized ||
      typeof sanitized !== 'object' ||
      Array.isArray(sanitized)
    ) {
      return null;
    }

    return sanitized as Record<string, unknown>;
  }

  private sanitizeUnknownGatewayValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeUnknownGatewayValue(item));
    }

    if (value && typeof value === 'object') {
      const sanitizedObject: Record<string, unknown> = {};

      for (const [key, itemValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (this.isSensitiveGatewayKey(key)) {
          sanitizedObject[key] = '[REDACTED]';
          continue;
        }

        sanitizedObject[key] = this.sanitizeUnknownGatewayValue(itemValue);
      }

      return sanitizedObject;
    }

    return value;
  }

  private isSensitiveGatewayKey(key: string): boolean {
    const normalizedKey = key
      .toLowerCase()
      .trim()
      .replace(/[\s_\-]/g, '');

    const sensitiveKeys = [
      'token',
      'cardtoken',
      'encryptedcard',
      'cardnumber',
      'card',
      'cvv',
      'securitycode',
      'pan',
      'rawcard',
      'accesstoken',
      'providertoken',
      'authorization',
      'clientsecret',
      'merchantkey',
      'secret',
      'password',
    ];

    return sensitiveKeys.includes(normalizedKey);
  }
}
