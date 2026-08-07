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

import { CreatePaymentSplitRecipientDtoIn } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/dtos/create-payment-split-recipient.dto-in';
import { CreatePaymentSplitRecipientService } from '../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service';
import { CreatePaymentSplitDtoIn } from '../../modules/payment-splits/services/create-payment-split/dtos/create-payment-split.dto-in';
import { CreatePaymentSplitService } from '../../modules/payment-splits/services/create-payment-split/create-payment-split.service';
import { CalculatePaymentSplitDtoIn } from '../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in';
import { CalculatePaymentSplitService } from '../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service';

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

    private readonly calculatePaymentSplitService: CalculatePaymentSplitService,
    private readonly createPaymentSplitService: CreatePaymentSplitService,
    private readonly createPaymentSplitRecipientService: CreatePaymentSplitRecipientService,

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

            gatewayProvider: dtoIn.gatewayProvider,
            gatewaySlug: dtoIn.gatewaySlug,

            gatewayId: dtoIn.gatewayId ?? checkoutSession.gatewayId,
            apiCredentialId:
              dtoIn.apiCredentialId ?? checkoutSession.apiCredentialId,
          }),
        );

      const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
      const resolvedApiCredential =
        resolvedGatewayCredentialDtoOut.apiCredential;

      this.assertResolvedGatewayMatchesCheckoutSession({
        checkoutSession,
        resolvedGateway,
        resolvedApiCredential,
      });

      let rawProviderPayload: Record<string, unknown> = {
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

      const splitRequired = this.resolveSplitRequired(
        checkoutSession.config,
        dtoIn.config,
      );

      const transactionDtoOut = await this.createPaymentTransactionService.exec(
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

          splitRequired,
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

      let createdPaymentTransaction =
        this.buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut);

      const paymentSplitSnapshot =
        await this.registerPaymentSplitForTransaction({
          checkoutSessionConfig: checkoutSession.config,
          requestConfig: dtoIn.config,
          token: dtoIn.token,
          paymentTransaction: createdPaymentTransaction,
          gatewayProvider: resolvedGateway.provider,
          metadata: {
            source: 'ProcessPaymentUseCase',
            checkoutSessionId: checkoutSession._id,
            paymentTransactionId: createdPaymentTransaction._id,
          },
        });

      if (paymentSplitSnapshot !== null) {
        rawProviderPayload = {
          ...rawProviderPayload,
          split: paymentSplitSnapshot,
        };

        const updatedWithSplitDtoOut =
          await this.updatePaymentTransactionService.exec(
            new UpdatePaymentTransactionDtoIn({
              _id: createdPaymentTransaction._id,

              hasSplit: true,

              providerPayload:
                this.sanitizeSensitiveGatewayData(rawProviderPayload),

              config: {
                ...(createdPaymentTransaction.config ?? {}),
                split: {
                  required: true,
                  paymentSplitId: String(paymentSplitSnapshot.paymentSplitId),
                  splitRuleId: String(paymentSplitSnapshot.splitRuleId),
                  mode: 'internal-calculation',
                },
              },

              source: 'ProcessPaymentUseCase.registerPaymentSplit',
            }),
          );

        createdPaymentTransaction = updatedWithSplitDtoOut.paymentTransaction;
      }

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

    const sanitized = this.sanitizeUnknownGatewayValue(data, new WeakSet());

    if (
      !sanitized ||
      typeof sanitized !== 'object' ||
      Array.isArray(sanitized)
    ) {
      return null;
    }

    return sanitized as Record<string, unknown>;
  }

  private sanitizeUnknownGatewayValue(
    value: unknown,
    seen: WeakSet<object>,
    depth = 0,
  ): unknown {
    if (depth > 32) {
      return '[TRUNCATED]';
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      if (seen.has(value)) {
        return '[CIRCULAR]';
      }

      seen.add(value);
      const sanitizedArray = value.map((item) =>
        this.sanitizeUnknownGatewayValue(item, seen, depth + 1),
      );
      seen.delete(value);

      return sanitizedArray;
    }

    if (value && typeof value === 'object') {
      if (seen.has(value)) {
        return '[CIRCULAR]';
      }

      seen.add(value);
      const sanitizedObject: Record<string, unknown> = {};

      for (const [key, itemValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (this.isSensitiveGatewayKey(key)) {
          sanitizedObject[key] = '[REDACTED]';
          continue;
        }

        sanitizedObject[key] = this.sanitizeUnknownGatewayValue(
          itemValue,
          seen,
          depth + 1,
        );
      }

      seen.delete(value);

      return sanitizedObject;
    }

    return value;
  }

  private isSensitiveGatewayKey(key: string): boolean {
    const normalizedKey = key
      .toLowerCase()
      .trim()
      .replace(/[\s_-]/g, '');

    const sensitiveKeys = [
      'token',
      'cardtoken',
      'encryptedcard',
      'encrypted_card',
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

    return 'processing';
  }

  private resolveSplitRequired(
    checkoutSessionConfig: Record<string, unknown> | null,
    requestConfig: Record<string, unknown> | null,
  ): boolean {
    const requestSplitRequired = this.getBooleanFromConfig(
      requestConfig,
      'splitRequired',
    );

    if (requestSplitRequired === false) {
      return false;
    }

    const requestSplitRuleId = this.getStringFromConfig(
      requestConfig,
      'splitRuleId',
    );

    if (requestSplitRuleId !== null) {
      return true;
    }

    if (requestSplitRequired === true) {
      throw new Error('splitRuleId is required when splitRequired is true');
    }

    const checkoutSessionSplitRuleId = this.getStringFromConfig(
      checkoutSessionConfig,
      'splitRuleId',
    );

    if (checkoutSessionSplitRuleId !== null) {
      return true;
    }

    return false;
  }

  private async registerPaymentSplitForTransaction(params: {
    checkoutSessionConfig: Record<string, unknown> | null;
    requestConfig: Record<string, unknown> | null;
    token: string;
    paymentTransaction: PaymentTransactionRow;
    gatewayProvider: string;
    metadata: Record<string, unknown>;
  }): Promise<Record<string, unknown> | null> {
    if (!params.paymentTransaction.splitRequired) {
      return null;
    }

    const splitRuleId = this.resolveSplitRuleId(
      params.checkoutSessionConfig,
      params.requestConfig,
    );

    if (splitRuleId === null) {
      throw new Error('splitRuleId is required when splitRequired is true');
    }

    const calculation = await this.calculatePaymentSplitService.exec(
      new CalculatePaymentSplitDtoIn(
        splitRuleId,
        params.paymentTransaction.amount,
        null,
        null,
        params.paymentTransaction.currency,
        params.metadata,
      ),
    );

    const splitRule = calculation.splitRule;

    const paymentSplitConfig = {
      splitRuleId,
      mode: 'internal-calculation',
      calculationSnapshot: {
        calculationBase: calculation.calculationBase,
        grossAmount: calculation.grossAmount,
        gatewayFeeAmount: calculation.gatewayFeeAmount,
        netAmount: calculation.netAmount,
        baseAmount: calculation.baseAmount,
        allocatedAmount: calculation.allocatedAmount,
        unallocatedAmount: calculation.unallocatedAmount,
        currency: calculation.currency,
      },
    };

    const paymentSplitDtoOut = await this.createPaymentSplitService.exec(
      new CreatePaymentSplitDtoIn(
        String(splitRule.officeId),
        String(splitRule.clientId),
        params.paymentTransaction.checkoutSessionId,
        params.paymentTransaction._id,
        null,
        null,
        splitRuleId,

        params.gatewayProvider,
        null,

        calculation.allocatedAmount,
        calculation.currency,

        null,
        null,
        null,
        params.metadata,
        paymentSplitConfig,

        'created',
      ),
    );

    const paymentSplitRecipients: Array<Record<string, unknown>> = [];

    for (const recipient of calculation.recipients) {
      const recipientConfig = {
        ...(recipient.config ?? {}),
        splitRuleRecipientId: recipient.splitRuleRecipientId,
        fixedAmount: recipient.fixedAmount,
        liableForGatewayFee: recipient.liableForGatewayFee,
        liableForRefund: recipient.liableForRefund,
        priority: recipient.priority,
      };

      const paymentSplitRecipientDtoOut =
        await this.createPaymentSplitRecipientService.exec(
          new CreatePaymentSplitRecipientDtoIn(
            String(paymentSplitDtoOut.paymentSplit._id),
            recipient.splitRecipientId,

            null,
            null,

            recipient.role,
            recipient.amount,
            recipient.percentage,
            recipient.currency,

            null,
            null,
            null,
            recipient.metadata,
            recipientConfig,

            'created',
          ),
        );

      paymentSplitRecipients.push(
        paymentSplitRecipientDtoOut.paymentSplitRecipient,
      );
    }

    return {
      paymentSplitId: paymentSplitDtoOut.paymentSplit._id,
      splitRuleId,
      calculationBase: calculation.calculationBase,
      grossAmount: calculation.grossAmount,
      gatewayFeeAmount: calculation.gatewayFeeAmount,
      netAmount: calculation.netAmount,
      baseAmount: calculation.baseAmount,
      allocatedAmount: calculation.allocatedAmount,
      unallocatedAmount: calculation.unallocatedAmount,
      currency: calculation.currency,
      recipients: paymentSplitRecipients,
    };
  }

  private resolveSplitRuleId(
    checkoutSessionConfig: Record<string, unknown> | null,
    requestConfig: Record<string, unknown> | null,
  ): string | null {
    const requestSplitRuleId = this.getStringFromConfig(
      requestConfig,
      'splitRuleId',
    );

    if (requestSplitRuleId !== null) {
      return requestSplitRuleId;
    }

    return this.getStringFromConfig(checkoutSessionConfig, 'splitRuleId');
  }

  private getStringFromConfig(
    config: Record<string, unknown> | null,
    key: string,
  ): string | null {
    if (config === null) {
      return null;
    }

    const value = config[key];

    if (value === undefined || value === null) {
      return null;
    }

    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean'
    ) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private assertResolvedGatewayMatchesCheckoutSession(params: {
    checkoutSession: {
      _id: string;
      gatewayId: string | null;
      apiCredentialId: string | null;
    };
    resolvedGateway: {
      _id: string;
      provider: string;
      slug: string;
    };
    resolvedApiCredential: {
      _id: string;
      gatewayId: string | null;
      slug: string;
    };
  }): void {
    if (
      params.checkoutSession.gatewayId !== null &&
      params.resolvedGateway._id !== params.checkoutSession.gatewayId
    ) {
      throw new Error(
        [
          'resolved gateway does not match checkout session gateway',
          `checkoutSessionId=${params.checkoutSession._id}`,
          `checkoutGatewayId=${params.checkoutSession.gatewayId}`,
          `resolvedGatewayId=${params.resolvedGateway._id}`,
          `resolvedGatewayProvider=${params.resolvedGateway.provider}`,
          `resolvedGatewaySlug=${params.resolvedGateway.slug}`,
        ].join(' | '),
      );
    }

    if (
      params.checkoutSession.apiCredentialId !== null &&
      params.resolvedApiCredential._id !==
        params.checkoutSession.apiCredentialId
    ) {
      throw new Error(
        [
          'resolved api credential does not match checkout session api credential',
          `checkoutSessionId=${params.checkoutSession._id}`,
          `checkoutApiCredentialId=${params.checkoutSession.apiCredentialId}`,
          `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
          `resolvedApiCredentialSlug=${params.resolvedApiCredential.slug}`,
        ].join(' | '),
      );
    }

    if (params.resolvedApiCredential.gatewayId === null) {
      throw new Error(
        [
          'resolved api credential does not have gateway id',
          `resolvedGatewayId=${params.resolvedGateway._id}`,
          `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
          `resolvedApiCredentialSlug=${params.resolvedApiCredential.slug}`,
        ].join(' | '),
      );
    }

    if (params.resolvedApiCredential.gatewayId !== params.resolvedGateway._id) {
      throw new Error(
        [
          'resolved api credential does not belong to resolved gateway',
          `resolvedGatewayId=${params.resolvedGateway._id}`,
          `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
          `resolvedApiCredentialGatewayId=${params.resolvedApiCredential.gatewayId}`,
        ].join(' | '),
      );
    }
  }

  private getBooleanFromConfig(
    config: Record<string, unknown> | null,
    key: string,
  ): boolean | null {
    if (config === null) {
      return null;
    }

    const value = config[key];

    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      return null;
    }

    const normalized = String(value).trim().toLowerCase();

    if (['true', '1', 'yes', 'sim'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'nao', 'não'].includes(normalized)) {
      return false;
    }

    return null;
  }

  private buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut: {
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
  }): PaymentTransactionRow {
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
