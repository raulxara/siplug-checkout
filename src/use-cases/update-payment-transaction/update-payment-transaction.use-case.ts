import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdatePaymentTransactionUseCaseDtoIn } from './dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionUseCaseDtoOut } from './dtos/update-payment-transaction.dto-out';

@Injectable()
export class UpdatePaymentTransactionUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentTransactionUseCaseDtoIn,
  ): Promise<UpdatePaymentTransactionUseCaseDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updatePaymentTransaction',
          requiredEntity: 'payment_transactions',
        }),
      );

      this.validateAllowedStatus(dtoIn.status);
      this.validateAllowedProcessStatus(dtoIn.processStatus);
      this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
      this.assertNoSensitiveFields(dtoIn.config, 'config');

      const dtoOut = await this.updatePaymentTransactionService.exec(
        new UpdatePaymentTransactionDtoIn({
          _id: dtoIn.paymentTransactionId,

          status: dtoIn.status,
          gatewayStatus: dtoIn.gatewayStatus,
          processStatus: dtoIn.processStatus,
          processMessage: dtoIn.processMessage,

          qrCode: dtoIn.qrCode,
          qrCodeBase64: dtoIn.qrCodeBase64,
          boletoUrl: dtoIn.boletoUrl,
          checkoutUrl: dtoIn.checkoutUrl,

          paidAt: dtoIn.paidAt,
          authorizedAt: dtoIn.authorizedAt,
          canceledAt: dtoIn.canceledAt,
          failedAt: dtoIn.failedAt,
          refundedAt: dtoIn.refundedAt,
          expiresAt: dtoIn.expiresAt,

          metadata: dtoIn.metadata,
          config: dtoIn.config,

          source: 'UpdatePaymentTransactionUseCase',
        }),
      );

      return new UpdatePaymentTransactionUseCaseDtoOut(
        dtoOut.paymentTransaction,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdatePaymentTransactionUseCase',
          error,
          appFile: __filename,
          context: {
            paymentTransactionId: dtoIn.paymentTransactionId,
            status: dtoIn.status,
            gatewayStatus: dtoIn.gatewayStatus,
            processStatus: dtoIn.processStatus,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update payment transaction use case';

      throw new Error(message);
    }
  }

  private validateAllowedStatus(status: string | null): void {
    if (status === null) {
      return;
    }

    const allowedStatuses = [
      'created',
      'pending',
      'processing',
      'authorized',
      'paid',
      'failed',
      'canceled',
      'refunded',
      'expired',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
    }
  }

  private validateAllowedProcessStatus(processStatus: string | null): void {
    if (processStatus === null) {
      return;
    }

    const allowedProcessStatuses = [
      'pending',
      'dispatching_gateway',
      'gateway_pending',
      'gateway_authorized',
      'gateway_approved',
      'gateway_rejected',
      'gateway_cancelled',
      'gateway_dispatched',
      'gateway_dispatch_failed',
      'gateway_dispatch_exception',
      'manual_update',
      'manual_review',
      'sync_pending',
      'sync_completed',
      'sync_failed',
    ];

    if (!allowedProcessStatuses.includes(processStatus)) {
      throw new Error(
        `processStatus must be one of: ${allowedProcessStatuses.join(', ')}`,
      );
    }
  }

  private assertNoSensitiveFields(
    data: Record<string, unknown> | null,
    path: string,
  ): void {
    if (data === null) {
      return;
    }

    const forbiddenKeys = [
      'token',
      'providerToken',
      'provider_token',
      'accessToken',
      'access_token',
      'authorization',
      'card',
      'cardNumber',
      'card_number',
      'cardToken',
      'card_token',
      'encryptedCard',
      'encrypted_card',
      'cvv',
      'securityCode',
      'security_code',
      'pan',
      'rawCard',
      'raw_card',
      'password',
      'secret',
      'clientSecret',
      'client_secret',
      'merchantKey',
      'merchant_key',
    ];

    for (const [key, value] of Object.entries(data)) {
      if (forbiddenKeys.includes(key)) {
        throw new Error(`forbidden sensitive field: ${path}.${key}`);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.assertNoSensitiveFields(
          value as Record<string, unknown>,
          `${path}.${key}`,
        );
      }
    }
  }
}
