import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { FindCheckoutSessionByUniqueIdDtoIn } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';

import { GatewayPaymentDtoIn } from '../../modules/gateway-orchestration/dtos/gateway-payment.dto-in';
import { DispatchGatewayPaymentService } from '../../modules/gateway-orchestration/services/dispatch-gateway-payment/dispatch-gateway-payment.service';
import { ResolvePaymentGatewayCredentialDtoIn } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in';
import { ResolvePaymentGatewayCredentialService } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';

import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';

import { FindPaymentCustomerByUniqueIdDtoIn } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { CreatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in';
import { CreatePaymentTransactionService } from '../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

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

    private readonly resolvePaymentGatewayCredentialService: ResolvePaymentGatewayCredentialService,
    private readonly dispatchGatewayPaymentService: DispatchGatewayPaymentService,

    private readonly createPaymentTransactionService: CreatePaymentTransactionService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

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

      if (!['created', 'processing'].includes(checkoutSession.status)) {
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

      this.validatePaymentType(checkoutSession.paymentType);

      this.validateInstallments({
        paymentType: checkoutSession.paymentType,
        paymentMethod: dtoIn.paymentMethod,
        amount: checkoutSession.amount,
        installments: dtoIn.installments,
        installmentAmount: dtoIn.installmentAmount,
        interestAmount: dtoIn.interestAmount,
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

      const resolvedGatewayCredentialDtoOut =
        await this.resolvePaymentGatewayCredentialService.exec(
          new ResolvePaymentGatewayCredentialDtoIn({
            officeId: checkoutSession.officeId,
            clientId: checkoutSession.clientId,
            paymentType: checkoutSession.paymentType,
            paymentMethod: dtoIn.paymentMethod,
          }),
        );

      const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
      const resolvedApiCredential =
        resolvedGatewayCredentialDtoOut.apiCredential;

      const rawProviderPayload: Record<string, unknown> = {
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
      };

      const sanitizedProviderPayload =
        this.sanitizeSensitiveGatewayData(rawProviderPayload);

      const transactionDtoOut =
        await this.createPaymentTransactionService.exec(
          new CreatePaymentTransactionDtoIn({
            officeId: checkoutSession.officeId,
            clientId: checkoutSession.clientId,
            checkoutSessionId: checkoutSession._id,
            paymentCustomerId: checkoutSession.paymentCustomerId,

            gatewayId: resolvedGateway._id,
            apiCredentialId: resolvedApiCredential._id,

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
            processStatus: 'dispatching_gateway',
            processMessage:
              'payment transaction created and dispatching to gateway',

            providerPayload: sanitizedProviderPayload,

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
              gatewaySlug: resolvedGateway.slug,
              gatewayProvider: resolvedGateway.provider,
              apiCredentialId: resolvedApiCredential._id,
              source: 'ProcessPaymentUseCase',
            },

            config: {
              ...(checkoutSession.config ?? {}),
              ...(dtoIn.config ?? {}),
            },
          }),
        );

      const createdPaymentTransaction =
        this.buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut);

      const gatewayPaymentDtoOut =
        await this.dispatchGatewayPaymentService.exec(
          new GatewayPaymentDtoIn({
            gatewayProvider: resolvedGateway.provider,
            gatewaySlug: resolvedGateway.slug,
            paymentTransaction: createdPaymentTransaction,
            apiCredential: {
              _id: resolvedApiCredential._id,
              slug: resolvedApiCredential.slug,
              gatewayId: resolvedApiCredential.gatewayId,
              token: resolvedGatewayCredentialDtoOut.decryptedProviderToken,
              config: resolvedApiCredential.config,
              connectionData: resolvedGatewayCredentialDtoOut.connectionData,
            },
            providerPayload: rawProviderPayload,
            idempotencyKey: createdPaymentTransaction.idempotencyKey,
            config: {
              gatewayConfig: resolvedGateway.config,
              transactionConfig: createdPaymentTransaction.config,
              apiCredentialConfig: resolvedApiCredential.config,
            },
          }),
        );

      const updatedTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: createdPaymentTransaction._id,

            gatewayTransactionId: gatewayPaymentDtoOut.gatewayTransactionId,
            gatewayStatus: gatewayPaymentDtoOut.gatewayStatus,

            status: gatewayPaymentDtoOut.status,
            processStatus: gatewayPaymentDtoOut.processStatus,
            processMessage: gatewayPaymentDtoOut.processMessage,

            providerPayload: this.sanitizeSensitiveGatewayData(
              gatewayPaymentDtoOut.providerRequest,
            ),
            providerResponse: this.sanitizeSensitiveGatewayData(
              gatewayPaymentDtoOut.providerResponse,
            ),
            gatewayResponse: this.sanitizeSensitiveGatewayData(
              gatewayPaymentDtoOut.gatewayResponse,
            ),

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

            source: 'ProcessPaymentUseCase.gatewayResponse',
          }),
        );

      const checkoutSessionStatus = this.resolveCheckoutSessionStatus(
        updatedTransactionDtoOut.paymentTransaction.status,
      );

      const updatedCheckoutSessionDtoOut =
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionDtoIn({
            _id: checkoutSession._id,
            status: checkoutSessionStatus,
            source: 'ProcessPaymentUseCase',
          }),
        );

      return new ProcessPaymentDtoOut(
        updatedCheckoutSessionDtoOut.checkoutSession,
        updatedTransactionDtoOut.paymentTransaction,
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
      'payment_link',
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

  private sanitizeSensitiveGatewayData(
    data: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (data === null) {
      return null;
    }

    const sanitized = this.sanitizeUnknownGatewayValue(data);

    if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) {
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
      'cardnumber',
      'card',
      'cvv',
      'securitycode',
      'pan',
      'rawcard',
      'accesstoken',
      'providertoken',
      'authorization',
    ];

    return sensitiveKeys.includes(normalizedKey);
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

  private resolveCheckoutSessionStatus(paymentTransactionStatus: string): string {
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

    return 'processing';
  }

  private buildPaymentTransactionRowFromCreateDtoOut(
    transactionDtoOut: {
      id: number;
      _id: string;
      officeId: string;
      clientId: string;
      checkoutSessionId: string | null;
      paymentCustomerId: string | null;
      gatewayId: string;
      apiCredentialId: string | null;
      gatewayTransactionId: string | null;
      externalReference: string | null;
      idempotencyKey: string | null;
      paymentType: string;
      paymentMethod: string;
      amount: number;
      currency: string;
      installments: number | null;
      installmentAmount: number | null;
      interestAmount: number | null;
      interestType: string | null;
      gatewayStatus: string | null;
      status: string;
      processStatus: string;
      processMessage: string | null;
      providerPayload: Record<string, unknown> | null;
      providerResponse: Record<string, unknown> | null;
      gatewayResponse: Record<string, unknown> | null;
      qrCode: string | null;
      qrCodeBase64: string | null;
      boletoUrl: string | null;
      checkoutUrl: string | null;
      splitRequired: boolean;
      hasSplit: boolean;
      paidAt: string | null;
      authorizedAt: string | null;
      canceledAt: string | null;
      failedAt: string | null;
      refundedAt: string | null;
      expiresAt: string | null;
      metadata: Record<string, unknown> | null;
      config: Record<string, unknown> | null;
      changesHistory: Array<Record<string, unknown>> | null;
      createdAt: string | null;
      updatedAt: string | null;
    },
  ): PaymentTransactionRow {
    return {
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
    };
  }
}