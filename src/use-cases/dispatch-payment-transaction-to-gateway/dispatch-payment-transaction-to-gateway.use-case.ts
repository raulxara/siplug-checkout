import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import {
  GatewayPaymentDtoIn,
  type GatewayApiCredentialData,
} from '../../modules/gateway-orchestration/dtos/gateway-payment.dto-in';

import { DecryptApiCredentialSecretDtoIn } from '../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { DispatchGatewayPaymentService } from '../../modules/gateway-orchestration/services/dispatch-gateway-payment/dispatch-gateway-payment.service';

import { FindGatewayByUniqueIdDtoIn } from '../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentTransactionByUniqueIdDtoIn } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { DispatchPaymentTransactionToGatewayDtoIn } from './dtos/dispatch-payment-transaction-to-gateway.dto-in';
import { DispatchPaymentTransactionToGatewayDtoOut } from './dtos/dispatch-payment-transaction-to-gateway.dto-out';

@Injectable()
export class DispatchPaymentTransactionToGatewayUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,

    private readonly dispatchGatewayPaymentService: DispatchGatewayPaymentService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: DispatchPaymentTransactionToGatewayDtoIn,
  ): Promise<DispatchPaymentTransactionToGatewayDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'dispatchPaymentTransactionToGateway',
          requiredEntity: 'payment_transactions',
        }),
      );

      const paymentTransactionDtoOut =
        await this.findPaymentTransactionByUniqueIdService.exec(
          new FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId),
        );

      const paymentTransaction = paymentTransactionDtoOut.paymentTransaction;

      if (paymentTransaction.processStatus !== 'pending_gateway_dispatch') {
        throw new Error('payment transaction is not pending gateway dispatch');
      }

      if (paymentTransaction.status !== 'created') {
        throw new Error('payment transaction is not available for dispatch');
      }

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(paymentTransaction.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(paymentTransaction.clientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== paymentTransaction.officeId) {
        throw new Error('client does not belong to office');
      }

      const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(
        new FindGatewayByUniqueIdDtoIn(paymentTransaction.gatewayId),
      );

      const gateway = gatewayDtoOut.gateway;

      if (gateway.status !== 'active') {
        throw new Error('gateway is not active');
      }

      let apiCredentialData: GatewayApiCredentialData | null = null;

      if (paymentTransaction.apiCredentialId !== null) {
        const apiCredentialDtoOut =
          await this.findApiCredentialByUniqueIdService.exec(
            new FindApiCredentialByUniqueIdDtoIn(
              paymentTransaction.apiCredentialId,
            ),
          );

        const apiCredential = apiCredentialDtoOut.apiCredential;

        if (apiCredential.status !== 'active') {
          throw new Error('api credential is not active');
        }

        if (
          apiCredential.gatewayId !== null &&
          apiCredential.gatewayId !== paymentTransaction.gatewayId
        ) {
          throw new Error('api credential does not belong to gateway');
        }

        if (apiCredential.token === null || apiCredential.token.trim() === '') {
        throw new Error('api credential token is required');
        }

        let apiCredentialData: GatewayApiCredentialData | null = null;

        if (apiCredential.token === null || apiCredential.token.trim() === '') {
        throw new Error('api credential token is required');
        }

        const decryptedCredentialDtoOut =
        this.decryptApiCredentialSecretService.exec(
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

        const decryptedProviderToken =
        this.extractDecryptedTokenFromApiCredentialConfig(
            decryptedCredentialDtoOut.apiCredential,
        );

        apiCredentialData = {
        _id: apiCredential._id,
        slug: apiCredential.slug,
        gatewayId: apiCredential.gatewayId,
        token: decryptedProviderToken,
        config: apiCredential.config,
        connectionData: {
            token: decryptedProviderToken,
            config: apiCredential.config,
        },
        };
      }

      const dispatchingTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,
            processStatus: 'dispatching_gateway',
            processMessage: 'dispatching payment transaction to gateway',
            source: 'DispatchPaymentTransactionToGatewayUseCase.preDispatch',
          }),
        );

      const gatewayPaymentDtoOut =
        await this.dispatchGatewayPaymentService.exec(
          new GatewayPaymentDtoIn({
            gatewayProvider: gateway.provider,
            gatewaySlug: gateway.slug,
            paymentTransaction: dispatchingTransactionDtoOut.paymentTransaction,
            apiCredential: apiCredentialData,
            providerPayload:
              dispatchingTransactionDtoOut.paymentTransaction.providerPayload,
            idempotencyKey:
              dispatchingTransactionDtoOut.paymentTransaction.idempotencyKey,
            config: {
              gatewayConfig: gateway.config,
              transactionConfig:
                dispatchingTransactionDtoOut.paymentTransaction.config,
            },
          }),
        );

      const updatedTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,

            gatewayTransactionId: gatewayPaymentDtoOut.gatewayTransactionId,
            gatewayStatus: gatewayPaymentDtoOut.gatewayStatus,

            status: gatewayPaymentDtoOut.status,
            processStatus: gatewayPaymentDtoOut.processStatus,
            processMessage: gatewayPaymentDtoOut.processMessage,

            providerPayload: gatewayPaymentDtoOut.providerRequest,
            providerResponse: gatewayPaymentDtoOut.providerResponse,
            gatewayResponse: gatewayPaymentDtoOut.gatewayResponse,

            qrCode: gatewayPaymentDtoOut.qrCode,
            qrCodeBase64: gatewayPaymentDtoOut.qrCodeBase64,
            boletoUrl: gatewayPaymentDtoOut.boletoUrl,
            checkoutUrl: gatewayPaymentDtoOut.checkoutUrl,

            paidAt: gatewayPaymentDtoOut.paidAt,
            authorizedAt: gatewayPaymentDtoOut.authorizedAt,
            canceledAt: gatewayPaymentDtoOut.canceledAt,
            failedAt: gatewayPaymentDtoOut.failedAt,
            refundedAt: gatewayPaymentDtoOut.refundedAt,
            expiresAt: gatewayPaymentDtoOut.expiresAt,

            source: 'DispatchPaymentTransactionToGatewayUseCase.postDispatch',
          }),
        );

      return new DispatchPaymentTransactionToGatewayDtoOut(
        updatedTransactionDtoOut.paymentTransaction,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'DispatchPaymentTransactionToGatewayUseCase',
          error,
          appFile: __filename,
          context: {
            paymentTransactionId: dtoIn.paymentTransactionId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on dispatch payment transaction to gateway use case';

      throw new Error(message);
    }
  }

  private extractDecryptedTokenFromApiCredentialConfig(
    apiCredential: Record<string, unknown>,
    ): string {
    const config = apiCredential.config;

    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('decrypted api credential config is invalid');
    }

    const token = (config as Record<string, unknown>).token;

    if (typeof token !== 'string' || token.trim() === '') {
        throw new Error('decrypted api credential token is invalid');
    }

    return token;
    }
}
