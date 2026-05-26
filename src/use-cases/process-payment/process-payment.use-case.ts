import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';

import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { FindCheckoutSessionByUniqueIdDtoIn } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { FindGatewayByUniqueIdDtoIn } from '../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';

import { CreatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in';
import { CreatePaymentTransactionService } from '../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ProcessPaymentDtoIn } from './dtos/process-payment.dto-in';
import { ProcessPaymentDtoOut } from './dtos/process-payment.dto-out';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findCheckoutSessionByUniqueIdService: FindCheckoutSessionByUniqueIdService,
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService,
    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly createPaymentTransactionService: CreatePaymentTransactionService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(dtoIn: ProcessPaymentDtoIn): Promise<ProcessPaymentDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'processPayment',
          requiredEntity: 'payment_transactions',
        }),
      );

      this.validatePaymentMethod(dtoIn.paymentMethod);

      this.assertNoForbiddenSensitivePaymentData({
        payer: dtoIn.payer,
        paymentData: dtoIn.paymentData,
        metadata: dtoIn.metadata,
        config: dtoIn.config,
      });

      const checkoutSessionDtoOut =
        await this.findCheckoutSessionByUniqueIdService.exec(
          new FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId),
        );

      const checkoutSession = checkoutSessionDtoOut.checkoutSession;

      if (checkoutSession.status !== 'created') {
        throw new Error('checkout session is not available for payment');
      }

      const officeDtoOut = await this.findOfficeByUniqueIdService.exec(
        new FindOfficeByUniqueIdDtoIn(checkoutSession.officeId),
      );

      if (officeDtoOut.office.status !== 'active') {
        throw new Error('office is not active');
      }

      const clientDtoOut = await this.findClientByUniqueIdService.exec(
        new FindClientByUniqueIdDtoIn(checkoutSession.clientId),
      );

      if (clientDtoOut.client.status !== 'active') {
        throw new Error('client is not active');
      }

      if (clientDtoOut.client.officeId !== checkoutSession.officeId) {
        throw new Error('client does not belong to office');
      }

      if (checkoutSession.paymentCustomerId !== null) {
        const paymentCustomerDtoOut =
          await this.findPaymentCustomerByUniqueIdService.exec(
            new FindPaymentCustomerByUniqueIdDtoIn(
              checkoutSession.paymentCustomerId,
            ),
          );

        const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;

        if (paymentCustomer.status !== 'active') {
          throw new Error('payment customer is not active');
        }

        if (paymentCustomer.officeId !== checkoutSession.officeId) {
          throw new Error('payment customer does not belong to office');
        }

        if (paymentCustomer.clientId !== checkoutSession.clientId) {
          throw new Error('payment customer does not belong to client');
        }
      }

      const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(
        new FindGatewayByUniqueIdDtoIn(checkoutSession.gatewayId),
      );

      const gateway = gatewayDtoOut.gateway;

      if (gateway.status !== 'active') {
        throw new Error('gateway is not active');
      }

      if (checkoutSession.apiCredentialId !== null) {
        const apiCredentialDtoOut =
          await this.findApiCredentialByUniqueIdService.exec(
            new FindApiCredentialByUniqueIdDtoIn(
              checkoutSession.apiCredentialId,
            ),
          );

        const apiCredential = apiCredentialDtoOut.apiCredential;

        if (apiCredential.status !== 'active') {
          throw new Error('api credential is not active');
        }

        if (
          apiCredential.gatewayId !== null &&
          apiCredential.gatewayId !== checkoutSession.gatewayId
        ) {
          throw new Error('api credential does not belong to gateway');
        }
      }

      this.validatePaymentType(checkoutSession.paymentType);
      this.validateInstallments({
        paymentType: checkoutSession.paymentType,
        paymentMethod: dtoIn.paymentMethod,
        amount: checkoutSession.amount,
        installments: dtoIn.installments,
        installmentAmount: dtoIn.installmentAmount,
        interestAmount: dtoIn.interestAmount,
      });

      this.validateGatewayCapabilities({
        paymentType: checkoutSession.paymentType,
        paymentMethod: dtoIn.paymentMethod,
        gatewayConfig: gateway.config,
      });

      const itemsDtoOut =
        await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(
          new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(
            checkoutSession._id,
          ),
        );

      const activeItems = itemsDtoOut.items.filter(
        (item) => item.status === 'active',
      );

      if (activeItems.length === 0) {
        throw new Error('checkout session must have at least one active item');
      }

      const activeItemsTotal = activeItems.reduce(
        (total, item) => total + item.totalAmount,
        0,
      );

      if (activeItemsTotal !== checkoutSession.amount) {
        throw new Error(
          'checkout session amount does not match active items total',
        );
      }

      const transactionDtoOut =
        await this.createPaymentTransactionService.exec(
          new CreatePaymentTransactionDtoIn({
            officeId: checkoutSession.officeId,
            clientId: checkoutSession.clientId,
            checkoutSessionId: checkoutSession._id,
            paymentCustomerId: checkoutSession.paymentCustomerId,

            gatewayId: checkoutSession.gatewayId,
            apiCredentialId: checkoutSession.apiCredentialId,

            gatewayTransactionId: null,
            externalReference:
              dtoIn.externalReference ?? checkoutSession.externalReference,
            idempotencyKey:
              dtoIn.idempotencyKey ?? checkoutSession.idempotencyKey,

            paymentType: checkoutSession.paymentType,
            paymentMethod: dtoIn.paymentMethod,

            amount: checkoutSession.amount,
            currency: checkoutSession.currency,

            installments: dtoIn.installments,
            installmentAmount: dtoIn.installmentAmount,
            interestAmount: dtoIn.interestAmount,
            interestType: dtoIn.interestType,

            gatewayStatus: null,
            status: 'created',
            processStatus: 'pending_gateway_dispatch',
            processMessage:
              'payment transaction created and waiting gateway dispatch',

            providerPayload: {
              checkoutSession: {
                _id: checkoutSession._id,
                code: checkoutSession.code,
                externalReference: checkoutSession.externalReference,
                paymentType: checkoutSession.paymentType,
                amount: checkoutSession.amount,
                currency: checkoutSession.currency,
                description: checkoutSession.description,
              },
              payer: dtoIn.payer,
              paymentData: dtoIn.paymentData,
              items: activeItems,
            },

            providerResponse: null,
            gatewayResponse: null,

            qrCode: null,
            qrCodeBase64: null,
            boletoUrl: null,
            checkoutUrl: null,

            splitRequired: Boolean(checkoutSession.config?.splitRequired),
            hasSplit: false,

            paidAt: null,
            authorizedAt: null,
            canceledAt: null,
            failedAt: null,
            refundedAt: null,
            expiresAt: checkoutSession.expiresAt,

            metadata: {
              ...(checkoutSession.metadata ?? {}),
              ...(dtoIn.metadata ?? {}),
              gatewaySlug: gateway.slug,
              gatewayProvider: gateway.provider,
              source: 'ProcessPaymentUseCase',
            },

            config: {
              ...(checkoutSession.config ?? {}),
              ...(dtoIn.config ?? {}),
            },
          }),
        );

      const updatedCheckoutSessionDtoOut =
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionDtoIn({
            _id: checkoutSession._id,
            status: 'processing',
            source: 'ProcessPaymentUseCase',
          }),
        );

      return new ProcessPaymentDtoOut(
        updatedCheckoutSessionDtoOut.checkoutSession,
        {
          id: transactionDtoOut.id,
          _id: transactionDtoOut._id,
          officeId: transactionDtoOut.officeId,
          clientId: transactionDtoOut.clientId,
          checkoutSessionId: transactionDtoOut.checkoutSessionId,
          paymentCustomerId: transactionDtoOut.paymentCustomerId,
          gatewayId: transactionDtoOut.gatewayId,
          apiCredentialId: transactionDtoOut.apiCredentialId,
          gatewayTransactionId: transactionDtoOut.gatewayTransactionId,
          externalReference: transactionDtoOut.externalReference,
          idempotencyKey: transactionDtoOut.idempotencyKey,
          paymentType: transactionDtoOut.paymentType,
          paymentMethod: transactionDtoOut.paymentMethod,
          amount: transactionDtoOut.amount,
          currency: transactionDtoOut.currency,
          installments: transactionDtoOut.installments,
          installmentAmount: transactionDtoOut.installmentAmount,
          interestAmount: transactionDtoOut.interestAmount,
          interestType: transactionDtoOut.interestType,
          gatewayStatus: transactionDtoOut.gatewayStatus,
          status: transactionDtoOut.status,
          processStatus: transactionDtoOut.processStatus,
          processMessage: transactionDtoOut.processMessage,
          providerPayload: transactionDtoOut.providerPayload,
          providerResponse: transactionDtoOut.providerResponse,
          gatewayResponse: transactionDtoOut.gatewayResponse,
          qrCode: transactionDtoOut.qrCode,
          qrCodeBase64: transactionDtoOut.qrCodeBase64,
          boletoUrl: transactionDtoOut.boletoUrl,
          checkoutUrl: transactionDtoOut.checkoutUrl,
          splitRequired: transactionDtoOut.splitRequired,
          hasSplit: transactionDtoOut.hasSplit,
          paidAt: transactionDtoOut.paidAt,
          authorizedAt: transactionDtoOut.authorizedAt,
          canceledAt: transactionDtoOut.canceledAt,
          failedAt: transactionDtoOut.failedAt,
          refundedAt: transactionDtoOut.refundedAt,
          expiresAt: transactionDtoOut.expiresAt,
          metadata: transactionDtoOut.metadata,
          config: transactionDtoOut.config,
          changesHistory: transactionDtoOut.changesHistory,
          createdAt: transactionDtoOut.createdAt,
          updatedAt: transactionDtoOut.updatedAt,
        },
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ProcessPaymentUseCase',
          error,
          appFile: __filename,
          context: {
            checkoutSessionId: dtoIn.checkoutSessionId,
            paymentMethod: dtoIn.paymentMethod,
            installments: dtoIn.installments,
            installmentAmount: dtoIn.installmentAmount,
            interestAmount: dtoIn.interestAmount,
            interestType: dtoIn.interestType,
            idempotencyKey: dtoIn.idempotencyKey,
            externalReference: dtoIn.externalReference,
            hasPayer: dtoIn.payer !== null,
            hasPaymentData: dtoIn.paymentData !== null,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on process payment use case';

      throw new Error(message);
    }
  }

  private validatePaymentType(paymentType: string): void {
    const allowedPaymentTypes = ['one_time', 'installment', 'recurring'];

    if (!allowedPaymentTypes.includes(paymentType)) {
      throw new Error(
        `paymentType must be one of: ${allowedPaymentTypes.join(', ')}`,
      );
    }
  }

  private validatePaymentMethod(paymentMethod: string): void {
    const allowedPaymentMethods = [
      'credit_card',
      'debit_card',
      'pix',
      'boleto',
    ];

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      throw new Error(
        `paymentMethod must be one of: ${allowedPaymentMethods.join(', ')}`,
      );
    }
  }

  private validateInstallments(params: {
    paymentType: string;
    paymentMethod: string;
    amount: number;
    installments: number | null;
    installmentAmount: number | null;
    interestAmount: number | null;
  }): void {
    if (params.paymentType === 'installment') {
      if (params.paymentMethod !== 'credit_card') {
        throw new Error('installment payment requires credit_card method');
      }

      if (params.installments === null || params.installments < 2) {
        throw new Error(
          'installments must be greater than or equal to 2 for installment payment',
        );
      }

      if (params.installmentAmount === null) {
        throw new Error(
          'installmentAmount is required for installment payment',
        );
      }

      const expectedTotal =
        params.installmentAmount * params.installments +
        (params.interestAmount ?? 0);

      if (expectedTotal !== params.amount) {
        throw new Error(
          'installmentAmount multiplied by installments plus interestAmount must match amount',
        );
      }

      return;
    }

    if (params.installments !== null && params.installments > 1) {
      throw new Error(
        'installments greater than 1 is allowed only for installment payment',
      );
    }
  }

  private validateGatewayCapabilities(params: {
    paymentType: string;
    paymentMethod: string;
    gatewayConfig: Record<string, unknown> | null;
  }): void {
    const config = params.gatewayConfig ?? {};

    if (
      params.paymentType === 'one_time' &&
      config.supportsOneTimePayment === false
    ) {
      throw new Error('gateway does not support one time payment');
    }

    if (
      params.paymentType === 'installment' &&
      config.supportsInstallments === false
    ) {
      throw new Error('gateway does not support installments');
    }

    if (
      params.paymentType === 'recurring' &&
      config.supportsRecurringPayment === false
    ) {
      throw new Error('gateway does not support recurring payment');
    }

    const supportedPaymentMethods = config.supportedPaymentMethods;

    if (Array.isArray(supportedPaymentMethods)) {
      const normalizedMethods = supportedPaymentMethods.map((method) =>
        String(method),
      );

      if (!normalizedMethods.includes(params.paymentMethod)) {
        throw new Error('gateway does not support selected payment method');
      }
    }
  }

  private assertNoForbiddenSensitivePaymentData(params: {
    payer: Record<string, unknown> | null;
    paymentData: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
  }): void {
    this.assertNoForbiddenKeys(params.payer, 'payer');
    this.assertNoForbiddenKeys(params.paymentData, 'paymentData');
    this.assertNoForbiddenKeys(params.metadata, 'metadata');
    this.assertNoForbiddenKeys(params.config, 'config');
  }

  private assertNoForbiddenKeys(
    data: Record<string, unknown> | null,
    path: string,
  ): void {
    if (data === null) {
      return;
    }

    const forbiddenKeys = [
      'card_number',
      'cardNumber',
      'cvv',
      'security_code',
      'securityCode',
      'raw_card',
      'rawCard',
      'pan',
    ];

    for (const [key, value] of Object.entries(data)) {
      if (forbiddenKeys.includes(key)) {
        throw new Error(`forbidden sensitive payment field: ${path}.${key}`);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.assertNoForbiddenKeys(
          value as Record<string, unknown>,
          `${path}.${key}`,
        );
      }
    }
  }
}
