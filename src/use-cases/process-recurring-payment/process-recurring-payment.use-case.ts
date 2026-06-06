import { Injectable } from '@nestjs/common';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';

import { FindCheckoutSessionByUniqueIdDtoIn } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { UpdateCheckoutSessionDtoIn } from '../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';

import { GatewayRecurringPaymentDtoIn } from '../../modules/gateway-orchestration/dtos/gateway-recurring-payment.dto-in';
import { DispatchGatewayRecurringPaymentService } from '../../modules/gateway-orchestration/services/dispatch-gateway-recurring-payment/dispatch-gateway-recurring-payment.service';
import { ResolvePaymentGatewayCredentialDtoIn } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in';
import { ResolvePaymentGatewayCredentialService } from '../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';

import type { PaymentTransactionRow } from '../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import { CreatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in';
import { CreatePaymentTransactionService } from '../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service';
import { UpdatePaymentTransactionDtoIn } from '../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in';
import { UpdatePaymentTransactionService } from '../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service';

import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { CreateSubscriptionCycleDtoIn } from '../../modules/subscription-cycles/services/create-subscription-cycle/dtos/create-subscription-cycle.dto-in';
import { CreateSubscriptionCycleService } from '../../modules/subscription-cycles/services/create-subscription-cycle/create-subscription-cycle.service';

import { CreateSubscriptionInvoiceDtoIn } from '../../modules/subscription-invoices/services/create-subscription-invoice/dtos/create-subscription-invoice.dto-in';
import { CreateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/create-subscription-invoice/create-subscription-invoice.service';
import { UpdateSubscriptionInvoiceDtoIn } from '../../modules/subscription-invoices/services/update-subscription-invoice/dtos/update-subscription-invoice.dto-in';
import { UpdateSubscriptionInvoiceService } from '../../modules/subscription-invoices/services/update-subscription-invoice/update-subscription-invoice.service';

import { FindSubscriptionPlanByUniqueIdDtoIn } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';

import { CreateSubscriptionDtoIn } from '../../modules/subscriptions/services/create-subscription/dtos/create-subscription.dto-in';
import { CreateSubscriptionService } from '../../modules/subscriptions/services/create-subscription/create-subscription.service';
import { UpdateSubscriptionDtoIn } from '../../modules/subscriptions/services/update-subscription/dtos/update-subscription.dto-in';
import { UpdateSubscriptionService } from '../../modules/subscriptions/services/update-subscription/update-subscription.service';

import { ProcessRecurringPaymentDtoIn } from './dtos/process-recurring-payment.dto-in';
import { ProcessRecurringPaymentDtoOut } from './dtos/process-recurring-payment.dto-out';
import { CreatePaymentCustomerDtoIn } from '../../modules/payment-customers/services/create-payment-customer/dtos/create-payment-customer.dto-in';
import { CreatePaymentCustomerService } from '../../modules/payment-customers/services/create-payment-customer/create-payment-customer.service';

@Injectable()
export class ProcessRecurringPaymentUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,

    private readonly findCheckoutSessionByUniqueIdService: FindCheckoutSessionByUniqueIdService,
    private readonly updateCheckoutSessionService: UpdateCheckoutSessionService,

    private readonly findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService,
    private readonly createPaymentCustomerService: CreatePaymentCustomerService,
    private readonly createSubscriptionService: CreateSubscriptionService,
    private readonly updateSubscriptionService: UpdateSubscriptionService,

    private readonly createSubscriptionCycleService: CreateSubscriptionCycleService,
    private readonly createSubscriptionInvoiceService: CreateSubscriptionInvoiceService,
    private readonly updateSubscriptionInvoiceService: UpdateSubscriptionInvoiceService,

    private readonly createPaymentTransactionService: CreatePaymentTransactionService,
    private readonly updatePaymentTransactionService: UpdatePaymentTransactionService,

    private readonly resolvePaymentGatewayCredentialService: ResolvePaymentGatewayCredentialService,
    private readonly dispatchGatewayRecurringPaymentService: DispatchGatewayRecurringPaymentService,

    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: ProcessRecurringPaymentDtoIn,
  ): Promise<ProcessRecurringPaymentDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'processRecurringPayment',
          requiredEntity: 'payments',
        }),
      );

      this.validatePaymentMethod(dtoIn.paymentMethod);
      this.assertNoForbiddenRawCardData({
        paymentData: dtoIn.paymentData,
        gatewayProvider: dtoIn.gatewayProvider,
        paymentMethod: dtoIn.paymentMethod,
      });
      this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
      this.assertNoSensitiveFields(dtoIn.config, 'config');

      const checkoutSessionDtoOut =
        await this.findCheckoutSessionByUniqueIdService.exec(
          new FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId),
        );

      const checkoutSession = checkoutSessionDtoOut.checkoutSession;
      const checkoutConfig = this.asObject(checkoutSession.config);
      const checkoutSubscriptionConfig = this.asObject(
        checkoutConfig.subscription,
      );

      if (checkoutSession.paymentType !== 'recurring') {
        throw new Error('checkout session paymentType must be recurring');
      }

      if (!['created', 'pending', 'processing'].includes(checkoutSession.status)) {
        throw new Error(
          `checkout session status does not allow recurring processing: ${checkoutSession.status}`,
        );
      }

      const subscriptionPlanId = this.toRequiredString(
        checkoutSubscriptionConfig.subscriptionPlanId,
        'checkoutSession.config.subscription.subscriptionPlanId is required',
      );

      const subscriptionPlanDtoOut =
        await this.findSubscriptionPlanByUniqueIdService.exec(
          new FindSubscriptionPlanByUniqueIdDtoIn(subscriptionPlanId),
        );

      const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;

      if (subscriptionPlan.status !== 'active') {
        throw new Error('subscription plan is not active');
      }

      if (subscriptionPlan.officeId !== checkoutSession.officeId) {
        throw new Error('subscription plan does not belong to checkout office');
      }

      if (subscriptionPlan.clientId !== checkoutSession.clientId) {
        throw new Error('subscription plan does not belong to checkout client');
      }

      const selectedGatewayId =
        dtoIn.gatewayId ??
        checkoutSession.gatewayId ??
        subscriptionPlan.gatewayId;

      const selectedApiCredentialId =
        dtoIn.apiCredentialId ??
        checkoutSession.apiCredentialId ??
        subscriptionPlan.apiCredentialId;

      if (selectedGatewayId === null) {
        throw new Error('gatewayId is required for recurring payment');
      }

      if (selectedApiCredentialId === null) {
        throw new Error('apiCredentialId is required for recurring payment');
      }

      const resolvedGatewayCredentialDtoOut =
        await this.resolvePaymentGatewayCredentialService.exec(
          new ResolvePaymentGatewayCredentialDtoIn({
            officeId: checkoutSession.officeId,
            clientId: checkoutSession.clientId,

            paymentType: 'recurring',
            paymentMethod: dtoIn.paymentMethod,

            gatewayProvider: dtoIn.gatewayProvider,
            gatewaySlug: dtoIn.gatewaySlug,
            gatewayId: selectedGatewayId,
            apiCredentialId: selectedApiCredentialId,
          }),
        );

      const paymentCustomerId = await this.resolveOrCreatePaymentCustomerId({
        checkoutPaymentCustomerId: checkoutSession.paymentCustomerId,
        officeId: checkoutSession.officeId,
        clientId: checkoutSession.clientId,
        payer: dtoIn.payer,
      });

      const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
      const resolvedApiCredential =
        resolvedGatewayCredentialDtoOut.apiCredential;

      const externalReference =
        checkoutSession.externalReference ??
        `recurring-checkout-${checkoutSession._id}`;

      const subscriptionDtoOut = await this.createSubscriptionService.exec(
        new CreateSubscriptionDtoIn(
          checkoutSession.officeId,
          checkoutSession.clientId,

          subscriptionPlan._id,
          paymentCustomerId,

          resolvedGateway._id,
          resolvedApiCredential._id,

          null,
          externalReference,

          checkoutSession.amount,
          checkoutSession.currency,

          0,

          this.resolveInitialNextBillingAt(subscriptionPlan.trialDays),
          null,
          null,
          null,

          {
            source: 'ProcessRecurringPaymentUseCase',
            checkoutSessionId: checkoutSession._id,
          },
          {
            recurringMode: 'gateway_native',
            checkoutSessionId: checkoutSession._id,
            subscriptionPlanSnapshot: {
              id: subscriptionPlan._id,
              name: subscriptionPlan.name,
              slug: subscriptionPlan.slug,
              amount: subscriptionPlan.amount,
              currency: subscriptionPlan.currency,
              billingInterval: subscriptionPlan.billingInterval,
              billingIntervalCount: subscriptionPlan.billingIntervalCount,
              trialDays: subscriptionPlan.trialDays,
              maxBillingCycles: subscriptionPlan.maxBillingCycles,
              paymentMethods: subscriptionPlan.paymentMethods,
            },
          },

          'pending',
        ),
      );

      const subscription = subscriptionDtoOut.subscription;

      const cycleNumber = 1;
      const scheduledAt = subscription.nextBillingAt ?? new Date().toISOString();
      const periodStart = scheduledAt;
      const periodEnd = this.calculatePeriodEnd(
        scheduledAt,
        subscriptionPlan.billingInterval,
        subscriptionPlan.billingIntervalCount,
      );

      const subscriptionCycleDtoOut =
        await this.createSubscriptionCycleService.exec(
          new CreateSubscriptionCycleDtoIn(
            subscription._id,
            cycleNumber,

            checkoutSession.amount,
            checkoutSession.currency,

            periodStart,
            periodEnd,
            scheduledAt,
            null,

            {
              source: 'ProcessRecurringPaymentUseCase',
              checkoutSessionId: checkoutSession._id,
              subscriptionPlanId: subscriptionPlan._id,
            },
            {
              recurringMode: 'gateway_native',
            },

            'scheduled',
          ),
        );

      const invoiceNumber = this.buildInvoiceNumber(subscription._id, cycleNumber);

      const subscriptionInvoiceDtoOut =
        await this.createSubscriptionInvoiceService.exec(
          new CreateSubscriptionInvoiceDtoIn(
            subscription._id,
            subscriptionCycleDtoOut.subscriptionCycle._id,
            null,

            invoiceNumber,

            checkoutSession.amount,
            checkoutSession.currency,

            scheduledAt,
            null,

            1,
            invoiceNumber,
            null,
            null,

            {
              source: 'ProcessRecurringPaymentUseCase',
              checkoutSessionId: checkoutSession._id,
              subscriptionPlanId: subscriptionPlan._id,
              cycleNumber,
            },
            {
              recurringMode: 'gateway_native',
              paymentCustomerId,
              gatewayId: resolvedGateway._id,
              apiCredentialId: resolvedApiCredential._id,
            },

            'created',
          ),
        );

      const subscriptionInvoice =
        subscriptionInvoiceDtoOut.subscriptionInvoice;

      const idempotencyKey = `recurring-${checkoutSession._id}-${subscriptionInvoice._id}`;

      const providerPayload: Record<string, unknown> = {
        checkoutSession: {
          _id: checkoutSession._id,
          code: checkoutSession.code,
          externalReference: checkoutSession.externalReference,
          amount: checkoutSession.amount,
          currency: checkoutSession.currency,
          successUrl: checkoutSession.successUrl,
          cancelUrl: checkoutSession.cancelUrl,
        },
        subscriptionPlan: {
          _id: subscriptionPlan._id,
          name: subscriptionPlan.name,
          slug: subscriptionPlan.slug,
          amount: subscriptionPlan.amount,
          currency: subscriptionPlan.currency,
          billingInterval: subscriptionPlan.billingInterval,
          billingIntervalCount: subscriptionPlan.billingIntervalCount,
          trialDays: subscriptionPlan.trialDays,
          gatewayPlanId: subscriptionPlan.gatewayPlanId,
          config: subscriptionPlan.config,
        },
        subscription: {
          _id: subscription._id,
          externalReference: subscription.externalReference,
        },
        subscriptionInvoice: {
          _id: subscriptionInvoice._id,
          invoiceNumber: subscriptionInvoice.invoiceNumber,
          amount: subscriptionInvoice.amount,
          currency: subscriptionInvoice.currency,
          dueAt: subscriptionInvoice.dueAt,
        },
        payer: dtoIn.payer,
        paymentData: dtoIn.paymentData,
        items: [
          {
            name: subscriptionPlan.name,
            quantity: 1,
            unitAmount: checkoutSession.amount,
            totalAmount: checkoutSession.amount,
          },
        ],
      };

      const createPaymentTransactionDtoOut =
        await this.createPaymentTransactionService.exec(
          new CreatePaymentTransactionDtoIn({
            officeId: checkoutSession.officeId,
            clientId: checkoutSession.clientId,

            checkoutSessionId: checkoutSession._id,
            paymentCustomerId,

            gatewayId: resolvedGateway._id,
            apiCredentialId: resolvedApiCredential._id,

            gatewayTransactionId: null,
            externalReference,
            idempotencyKey,

            paymentType: 'recurring',
            paymentMethod: dtoIn.paymentMethod,

            amount: checkoutSession.amount,
            currency: checkoutSession.currency,

            installments: null,
            installmentAmount: null,
            interestAmount: null,
            interestType: null,

            gatewayStatus: null,
            status: 'created',
            processStatus: 'dispatching_gateway',
            processMessage:
              'recurring payment transaction created and dispatching to gateway',

            providerPayload: this.sanitizeSensitiveGatewayData(providerPayload),
            providerResponse: null,
            gatewayResponse: null,

            qrCode: null,
            qrCodeBase64: null,
            boletoUrl: null,
            checkoutUrl: null,

            splitRequired: false,
            hasSplit: false,

            paidAt: null,
            authorizedAt: null,
            canceledAt: null,
            failedAt: null,
            refundedAt: null,
            expiresAt: checkoutSession.expiresAt,

            metadata: {
              ...(dtoIn.metadata ?? {}),
              source: 'ProcessRecurringPaymentUseCase',
              checkoutSessionId: checkoutSession._id,
              subscriptionPlanId: subscriptionPlan._id,
              subscriptionId: subscription._id,
              subscriptionCycleId: subscriptionCycleDtoOut.subscriptionCycle._id,
              subscriptionInvoiceId: subscriptionInvoice._id,
            },

            config: {
              ...(dtoIn.config ?? {}),
              recurringMode: 'gateway_native',
              gatewayProvider: resolvedGateway.provider,
              gatewaySlug: resolvedGateway.slug,
            },
          }),
        );

      const paymentTransaction =
        this.buildPaymentTransactionRowFromCreateDtoOut(
          createPaymentTransactionDtoOut,
        );

      const gatewayRecurringDtoOut =
        await this.dispatchGatewayRecurringPaymentService.exec(
          new GatewayRecurringPaymentDtoIn({
            gatewayProvider: resolvedGateway.provider,
            gatewaySlug: resolvedGateway.slug,

            subscriptionPlan,
            subscription,
            subscriptionInvoice,
            paymentTransaction,

            apiCredential: {
              _id: resolvedApiCredential._id,
              slug: resolvedApiCredential.slug,
              gatewayId: resolvedApiCredential.gatewayId,
              token: resolvedGatewayCredentialDtoOut.decryptedProviderToken,
              config: resolvedApiCredential.config,
              connectionData: resolvedGatewayCredentialDtoOut.connectionData,
            },

            providerPayload,
            idempotencyKey,

            config: {
              gatewayConfig: resolvedGateway.config,
              transactionConfig: paymentTransaction.config,
              apiCredentialConfig: resolvedApiCredential.config,
              subscriptionPlanConfig: subscriptionPlan.config,
              subscriptionConfig: subscription.config,
              subscriptionInvoiceConfig: subscriptionInvoice.config,
              checkoutSessionConfig: checkoutSession.config,
            },
          }),
        );

      const updatedPaymentTransactionDtoOut =
        await this.updatePaymentTransactionService.exec(
          new UpdatePaymentTransactionDtoIn({
            _id: paymentTransaction._id,

            gatewayTransactionId: gatewayRecurringDtoOut.gatewayTransactionId,
            gatewayStatus: gatewayRecurringDtoOut.gatewayStatus,

            status: gatewayRecurringDtoOut.status,
            processStatus: gatewayRecurringDtoOut.processStatus,
            processMessage: gatewayRecurringDtoOut.processMessage,

            providerPayload: this.sanitizeSensitiveGatewayData(
              gatewayRecurringDtoOut.providerRequest,
            ),
            providerResponse: this.sanitizeSensitiveGatewayData(
              gatewayRecurringDtoOut.providerResponse,
            ),
            gatewayResponse: this.sanitizeSensitiveGatewayData(
              gatewayRecurringDtoOut.gatewayResponse,
            ),

            qrCode: gatewayRecurringDtoOut.qrCode,
            qrCodeBase64: gatewayRecurringDtoOut.qrCodeBase64,
            boletoUrl: gatewayRecurringDtoOut.boletoUrl,
            checkoutUrl:
              gatewayRecurringDtoOut.checkoutUrl ??
              gatewayRecurringDtoOut.approvalUrl,

            paidAt: gatewayRecurringDtoOut.paidAt,
            authorizedAt: gatewayRecurringDtoOut.authorizedAt,
            canceledAt: gatewayRecurringDtoOut.canceledAt,
            failedAt: gatewayRecurringDtoOut.failedAt,
            refundedAt: gatewayRecurringDtoOut.refundedAt,
            expiresAt: gatewayRecurringDtoOut.expiresAt,

            source: 'ProcessRecurringPaymentUseCase.gatewayResponse',
          }),
        );

      const updatedSubscriptionDtoOut =
        await this.updateSubscriptionService.exec(
          new UpdateSubscriptionDtoIn(
            subscription._id,

            1,
            periodEnd,
            subscription.startedAt,
            null,
            null,

            subscription.metadata,
            {
              ...(subscription.config ?? {}),
              gatewaySubscriptionId:
                gatewayRecurringDtoOut.gatewaySubscriptionId,
              gatewayPlanId: gatewayRecurringDtoOut.gatewayPlanId,
              checkoutUrl:
                gatewayRecurringDtoOut.checkoutUrl ??
                gatewayRecurringDtoOut.approvalUrl,
            },

            this.resolveSubscriptionStatus(gatewayRecurringDtoOut.status),
            'ProcessRecurringPaymentUseCase.gatewayResponse',

            gatewayRecurringDtoOut.gatewaySubscriptionId,
          ),
        );

      const updatedInvoiceDtoOut =
        await this.updateSubscriptionInvoiceService.exec(
          new UpdateSubscriptionInvoiceDtoIn(
            subscriptionInvoice._id,

            updatedPaymentTransactionDtoOut.paymentTransaction._id,
            gatewayRecurringDtoOut.gatewayInvoiceId ??
              gatewayRecurringDtoOut.gatewayTransactionId,
            this.nowAsIso(),
            2,

            gatewayRecurringDtoOut.paidAt,

            subscriptionInvoice.metadata,
            subscriptionInvoice.config,

            this.resolveInvoiceStatus(gatewayRecurringDtoOut.status),
            'ProcessRecurringPaymentUseCase.gatewayResponse',
          ),
        );

      const updatedCheckoutSessionDtoOut =
        await this.updateCheckoutSessionService.exec(
          new UpdateCheckoutSessionDtoIn({
            _id: checkoutSession._id,
            gatewayId: resolvedGateway._id,
            apiCredentialId: resolvedApiCredential._id,
            config: this.mergeCheckoutSessionRecurringConfig({
              currentConfig: checkoutSession.config,
              subscriptionPlanId: subscriptionPlan._id,
              subscriptionId: updatedSubscriptionDtoOut.subscription._id,
              subscriptionCycleId: subscriptionCycleDtoOut.subscriptionCycle._id,
              subscriptionInvoiceId:
                updatedInvoiceDtoOut.subscriptionInvoice._id,
              paymentTransactionId:
                updatedPaymentTransactionDtoOut.paymentTransaction._id,
              gatewaySubscriptionId:
                gatewayRecurringDtoOut.gatewaySubscriptionId,
              gatewayPlanId: gatewayRecurringDtoOut.gatewayPlanId,
              checkoutUrl:
                gatewayRecurringDtoOut.checkoutUrl ??
                gatewayRecurringDtoOut.approvalUrl,
            }),
            status: this.resolveCheckoutSessionStatus(
              gatewayRecurringDtoOut.status,
            ),
            source: 'ProcessRecurringPaymentUseCase.gatewayResponse',
          }),
        );

      return new ProcessRecurringPaymentDtoOut(
        updatedSubscriptionDtoOut.subscription,
        subscriptionCycleDtoOut.subscriptionCycle,
        updatedInvoiceDtoOut.subscriptionInvoice,
        updatedPaymentTransactionDtoOut.paymentTransaction,
        updatedCheckoutSessionDtoOut.checkoutSession as unknown as Record<
          string,
          unknown
        >,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'ProcessRecurringPaymentUseCase',
          error,
          appFile: __filename,
          context: {
            checkoutSessionId: dtoIn.checkoutSessionId,
            paymentMethod: dtoIn.paymentMethod,
            gatewayProvider: dtoIn.gatewayProvider,
            gatewaySlug: dtoIn.gatewaySlug,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on process recurring payment use case';

      throw new Error(message);
    }
  }

  private resolveInitialNextBillingAt(trialDays: number | null): string {
    const date = new Date();

    if (trialDays !== null && trialDays > 0) {
      date.setDate(date.getDate() + trialDays);
    }

    return date.toISOString();
  }

  private calculatePeriodEnd(
    startIso: string,
    interval: string,
    intervalCount: number,
  ): string {
    const date = new Date(startIso);

    if (interval === 'day') {
      date.setDate(date.getDate() + intervalCount);
      return date.toISOString();
    }

    if (interval === 'week') {
      date.setDate(date.getDate() + intervalCount * 7);
      return date.toISOString();
    }

    if (interval === 'month') {
      date.setMonth(date.getMonth() + intervalCount);
      return date.toISOString();
    }

    if (interval === 'year') {
      date.setFullYear(date.getFullYear() + intervalCount);
      return date.toISOString();
    }

    throw new Error(`unsupported subscription interval: ${interval}`);
  }

  private buildInvoiceNumber(subscriptionId: string, cycleNumber: number): string {
    const cleanSubscriptionId = subscriptionId.replace(/[^a-zA-Z0-9]/g, '');

    return `INV-${cleanSubscriptionId.slice(0, 12)}-${String(cycleNumber).padStart(6, '0')}`;
  }

  private mergeCheckoutSessionRecurringConfig(params: {
    currentConfig: Record<string, unknown> | null;
    subscriptionPlanId: string;
    subscriptionId: string;
    subscriptionCycleId: string;
    subscriptionInvoiceId: string;
    paymentTransactionId: string;
    gatewaySubscriptionId: string | null;
    gatewayPlanId: string | null;
    checkoutUrl: string | null;
  }): Record<string, unknown> {
    const currentConfig = this.asObject(params.currentConfig);
    const currentSubscriptionConfig = this.asObject(currentConfig.subscription);

    return {
      ...currentConfig,
      paymentType: 'recurring',
      subscription: {
        ...currentSubscriptionConfig,
        recurringMode: 'gateway_native',
        subscriptionPlanId: params.subscriptionPlanId,
        subscriptionId: params.subscriptionId,
        subscriptionCycleId: params.subscriptionCycleId,
        subscriptionInvoiceId: params.subscriptionInvoiceId,
        paymentTransactionId: params.paymentTransactionId,
        gatewaySubscriptionId: params.gatewaySubscriptionId,
        gatewayPlanId: params.gatewayPlanId,
        checkoutUrl: params.checkoutUrl,
      },
    };
  }

  private resolveSubscriptionStatus(gatewayStatus: string): string {
    if (gatewayStatus === 'paid' || gatewayStatus === 'authorized') {
      return 'active';
    }

    if (gatewayStatus === 'failed') {
      return 'pending';
    }

    if (gatewayStatus === 'canceled') {
      return 'canceled';
    }

    return 'pending';
  }

  private resolveInvoiceStatus(gatewayStatus: string): string {
    if (gatewayStatus === 'paid') {
      return 'paid';
    }

    if (gatewayStatus === 'failed') {
      return 'failed';
    }

    if (gatewayStatus === 'canceled') {
      return 'canceled';
    }

    return 'processing';
  }

  private resolveCheckoutSessionStatus(gatewayStatus: string): string {
    if (gatewayStatus === 'paid' || gatewayStatus === 'authorized') {
      return 'paid';
    }

    if (gatewayStatus === 'failed') {
      return 'failed';
    }

    if (gatewayStatus === 'canceled') {
      return 'canceled';
    }

    return 'processing';
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

  private assertNoForbiddenRawCardData(params: {
    paymentData: Record<string, unknown> | null;
    gatewayProvider: string | null;
    paymentMethod: string;
  }): void {
    if (params.paymentData === null) {
      return;
    }

    const normalizedGatewayProvider = this.normalizeProviderName(
      params.gatewayProvider,
    );

    const allowsPagSeguroRecurringSecurityCode =
      (normalizedGatewayProvider === 'pagseguro' ||
        normalizedGatewayProvider === 'pagbank') &&
      params.paymentMethod === 'credit_card';

    const forbiddenKeys = [
      'cardNumber',
      'card_number',
      'number',
      'pan',
      'rawCard',
      'raw_card',
    ];

    const sensitiveAllowedOnlyForPagSeguroKeys = [
      'cvv',
      'securityCode',
      'security_code',
    ];

    for (const [key, value] of Object.entries(params.paymentData)) {
      if (forbiddenKeys.includes(key)) {
        throw new Error(`forbidden sensitive payment field: paymentData.${key}`);
      }

      if (
        sensitiveAllowedOnlyForPagSeguroKeys.includes(key) &&
        !allowsPagSeguroRecurringSecurityCode
      ) {
        throw new Error(`forbidden sensitive payment field: paymentData.${key}`);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.assertNoForbiddenRawCardData({
          paymentData: value as Record<string, unknown>,
          gatewayProvider: params.gatewayProvider,
          paymentMethod: params.paymentMethod,
        });
      }
    }
  }

  private normalizeProviderName(provider: string | null): string {
    if (provider === null) {
      return '';
    }

    return provider
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
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

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private toRequiredString(value: unknown, message: string): string {
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new Error(message);
    }

    return String(value).trim();
  }

  private nowAsIso(): string {
    return new Date().toISOString();
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
  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
        return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
    }

  private async resolveOrCreatePaymentCustomerId(params: {
    checkoutPaymentCustomerId: string | null;
    officeId: string;
    clientId: string;
    payer: Record<string, unknown> | null;
    }): Promise<string> {
    if (
        params.checkoutPaymentCustomerId !== null &&
        params.checkoutPaymentCustomerId.trim() !== ''
    ) {
        return params.checkoutPaymentCustomerId;
    }

    if (params.payer === null) {
        throw new Error(
        'payer is required to create payment customer for recurring payment',
        );
    }

    const name = this.toRequiredString(
        params.payer.name,
        'payer.name is required',
    );

    const email = this.toRequiredString(
        params.payer.email,
        'payer.email is required',
    );

    const documentType = this.toRequiredString(
        params.payer.documentType,
        'payer.documentType is required',
    );

    const documentValue = this.toRequiredString(
        params.payer.documentValue,
        'payer.documentValue is required',
    );

    const phoneNumber = this.toNullableString(params.payer.phoneNumber);

    const createPaymentCustomerDtoOut =
    await this.createPaymentCustomerService.exec(
        new CreatePaymentCustomerDtoIn({
        officeId: params.officeId,
        clientId: params.clientId,

        name,
        email,

        documentType,
        documentValue,

        metadata: {
            source: 'ProcessRecurringPaymentUseCase',
            createdFrom: 'checkout_session',
            phoneNumber,
            gatewayCustomerId: null,
        },

        config: {
            recurring: true,
        },

        status: 'active',
        }),
    );

    return createPaymentCustomerDtoOut._id;
    }
}
