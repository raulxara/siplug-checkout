"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessRecurringPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_checkout_session_by_unique_id_dto_in_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in");
const find_checkout_session_by_unique_id_service_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const gateway_recurring_payment_dto_in_1 = require("../../modules/gateway-orchestration/dtos/gateway-recurring-payment.dto-in");
const dispatch_gateway_recurring_payment_service_1 = require("../../modules/gateway-orchestration/services/dispatch-gateway-recurring-payment/dispatch-gateway-recurring-payment.service");
const resolve_payment_gateway_credential_dto_in_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in");
const resolve_payment_gateway_credential_service_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service");
const create_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in");
const create_payment_transaction_service_1 = require("../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const create_subscription_cycle_dto_in_1 = require("../../modules/subscription-cycles/services/create-subscription-cycle/dtos/create-subscription-cycle.dto-in");
const create_subscription_cycle_service_1 = require("../../modules/subscription-cycles/services/create-subscription-cycle/create-subscription-cycle.service");
const create_subscription_invoice_dto_in_1 = require("../../modules/subscription-invoices/services/create-subscription-invoice/dtos/create-subscription-invoice.dto-in");
const create_subscription_invoice_service_1 = require("../../modules/subscription-invoices/services/create-subscription-invoice/create-subscription-invoice.service");
const update_subscription_invoice_dto_in_1 = require("../../modules/subscription-invoices/services/update-subscription-invoice/dtos/update-subscription-invoice.dto-in");
const update_subscription_invoice_service_1 = require("../../modules/subscription-invoices/services/update-subscription-invoice/update-subscription-invoice.service");
const find_subscription_plan_by_unique_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in");
const find_subscription_plan_by_unique_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const create_subscription_dto_in_1 = require("../../modules/subscriptions/services/create-subscription/dtos/create-subscription.dto-in");
const create_subscription_service_1 = require("../../modules/subscriptions/services/create-subscription/create-subscription.service");
const update_subscription_dto_in_1 = require("../../modules/subscriptions/services/update-subscription/dtos/update-subscription.dto-in");
const update_subscription_service_1 = require("../../modules/subscriptions/services/update-subscription/update-subscription.service");
const process_recurring_payment_dto_out_1 = require("./dtos/process-recurring-payment.dto-out");
const create_payment_customer_dto_in_1 = require("../../modules/payment-customers/services/create-payment-customer/dtos/create-payment-customer.dto-in");
const create_payment_customer_service_1 = require("../../modules/payment-customers/services/create-payment-customer/create-payment-customer.service");
let ProcessRecurringPaymentUseCase = class ProcessRecurringPaymentUseCase {
    resolveActorAuthorizationService;
    findCheckoutSessionByUniqueIdService;
    updateCheckoutSessionService;
    findSubscriptionPlanByUniqueIdService;
    createPaymentCustomerService;
    createSubscriptionService;
    updateSubscriptionService;
    createSubscriptionCycleService;
    createSubscriptionInvoiceService;
    updateSubscriptionInvoiceService;
    createPaymentTransactionService;
    updatePaymentTransactionService;
    resolvePaymentGatewayCredentialService;
    dispatchGatewayRecurringPaymentService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findCheckoutSessionByUniqueIdService, updateCheckoutSessionService, findSubscriptionPlanByUniqueIdService, createPaymentCustomerService, createSubscriptionService, updateSubscriptionService, createSubscriptionCycleService, createSubscriptionInvoiceService, updateSubscriptionInvoiceService, createPaymentTransactionService, updatePaymentTransactionService, resolvePaymentGatewayCredentialService, dispatchGatewayRecurringPaymentService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findCheckoutSessionByUniqueIdService = findCheckoutSessionByUniqueIdService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.findSubscriptionPlanByUniqueIdService = findSubscriptionPlanByUniqueIdService;
        this.createPaymentCustomerService = createPaymentCustomerService;
        this.createSubscriptionService = createSubscriptionService;
        this.updateSubscriptionService = updateSubscriptionService;
        this.createSubscriptionCycleService = createSubscriptionCycleService;
        this.createSubscriptionInvoiceService = createSubscriptionInvoiceService;
        this.updateSubscriptionInvoiceService = updateSubscriptionInvoiceService;
        this.createPaymentTransactionService = createPaymentTransactionService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.resolvePaymentGatewayCredentialService = resolvePaymentGatewayCredentialService;
        this.dispatchGatewayRecurringPaymentService = dispatchGatewayRecurringPaymentService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'processRecurringPayment',
                requiredEntity: 'payments',
            }));
            this.validatePaymentMethod(dtoIn.paymentMethod);
            this.assertNoForbiddenRawCardData(dtoIn.paymentData);
            this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
            this.assertNoSensitiveFields(dtoIn.config, 'config');
            const checkoutSessionDtoOut = await this.findCheckoutSessionByUniqueIdService.exec(new find_checkout_session_by_unique_id_dto_in_1.FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId));
            const checkoutSession = checkoutSessionDtoOut.checkoutSession;
            const checkoutConfig = this.asObject(checkoutSession.config);
            const checkoutSubscriptionConfig = this.asObject(checkoutConfig.subscription);
            if (checkoutSession.paymentType !== 'recurring') {
                throw new Error('checkout session paymentType must be recurring');
            }
            if (!['created', 'pending', 'processing'].includes(checkoutSession.status)) {
                throw new Error(`checkout session status does not allow recurring processing: ${checkoutSession.status}`);
            }
            const subscriptionPlanId = this.toRequiredString(checkoutSubscriptionConfig.subscriptionPlanId, 'checkoutSession.config.subscription.subscriptionPlanId is required');
            const subscriptionPlanDtoOut = await this.findSubscriptionPlanByUniqueIdService.exec(new find_subscription_plan_by_unique_id_dto_in_1.FindSubscriptionPlanByUniqueIdDtoIn(subscriptionPlanId));
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
            const selectedGatewayId = dtoIn.gatewayId ??
                checkoutSession.gatewayId ??
                subscriptionPlan.gatewayId;
            const selectedApiCredentialId = dtoIn.apiCredentialId ??
                checkoutSession.apiCredentialId ??
                subscriptionPlan.apiCredentialId;
            if (selectedGatewayId === null) {
                throw new Error('gatewayId is required for recurring payment');
            }
            if (selectedApiCredentialId === null) {
                throw new Error('apiCredentialId is required for recurring payment');
            }
            const resolvedGatewayCredentialDtoOut = await this.resolvePaymentGatewayCredentialService.exec(new resolve_payment_gateway_credential_dto_in_1.ResolvePaymentGatewayCredentialDtoIn({
                officeId: checkoutSession.officeId,
                clientId: checkoutSession.clientId,
                paymentType: 'recurring',
                paymentMethod: dtoIn.paymentMethod,
                gatewayProvider: dtoIn.gatewayProvider,
                gatewaySlug: dtoIn.gatewaySlug,
                gatewayId: selectedGatewayId,
                apiCredentialId: selectedApiCredentialId,
            }));
            const paymentCustomerId = await this.resolveOrCreatePaymentCustomerId({
                checkoutPaymentCustomerId: checkoutSession.paymentCustomerId,
                officeId: checkoutSession.officeId,
                clientId: checkoutSession.clientId,
                payer: dtoIn.payer,
            });
            const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
            const resolvedApiCredential = resolvedGatewayCredentialDtoOut.apiCredential;
            const externalReference = checkoutSession.externalReference ??
                `recurring-checkout-${checkoutSession._id}`;
            const subscriptionDtoOut = await this.createSubscriptionService.exec(new create_subscription_dto_in_1.CreateSubscriptionDtoIn(checkoutSession.officeId, checkoutSession.clientId, subscriptionPlan._id, paymentCustomerId, resolvedGateway._id, resolvedApiCredential._id, null, externalReference, checkoutSession.amount, checkoutSession.currency, 0, this.resolveInitialNextBillingAt(subscriptionPlan.trialDays), null, null, null, {
                source: 'ProcessRecurringPaymentUseCase',
                checkoutSessionId: checkoutSession._id,
            }, {
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
            }, 'pending'));
            const subscription = subscriptionDtoOut.subscription;
            const cycleNumber = 1;
            const scheduledAt = subscription.nextBillingAt ?? new Date().toISOString();
            const periodStart = scheduledAt;
            const periodEnd = this.calculatePeriodEnd(scheduledAt, subscriptionPlan.billingInterval, subscriptionPlan.billingIntervalCount);
            const subscriptionCycleDtoOut = await this.createSubscriptionCycleService.exec(new create_subscription_cycle_dto_in_1.CreateSubscriptionCycleDtoIn(subscription._id, cycleNumber, checkoutSession.amount, checkoutSession.currency, periodStart, periodEnd, scheduledAt, null, {
                source: 'ProcessRecurringPaymentUseCase',
                checkoutSessionId: checkoutSession._id,
                subscriptionPlanId: subscriptionPlan._id,
            }, {
                recurringMode: 'gateway_native',
            }, 'scheduled'));
            const invoiceNumber = this.buildInvoiceNumber(subscription._id, cycleNumber);
            const subscriptionInvoiceDtoOut = await this.createSubscriptionInvoiceService.exec(new create_subscription_invoice_dto_in_1.CreateSubscriptionInvoiceDtoIn(subscription._id, subscriptionCycleDtoOut.subscriptionCycle._id, null, invoiceNumber, checkoutSession.amount, checkoutSession.currency, scheduledAt, null, 1, invoiceNumber, null, null, {
                source: 'ProcessRecurringPaymentUseCase',
                checkoutSessionId: checkoutSession._id,
                subscriptionPlanId: subscriptionPlan._id,
                cycleNumber,
            }, {
                recurringMode: 'gateway_native',
                paymentCustomerId,
                gatewayId: resolvedGateway._id,
                apiCredentialId: resolvedApiCredential._id,
            }, 'created'));
            const subscriptionInvoice = subscriptionInvoiceDtoOut.subscriptionInvoice;
            const idempotencyKey = `recurring-${checkoutSession._id}-${subscriptionInvoice._id}`;
            const providerPayload = {
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
            const createPaymentTransactionDtoOut = await this.createPaymentTransactionService.exec(new create_payment_transaction_dto_in_1.CreatePaymentTransactionDtoIn({
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
                processMessage: 'recurring payment transaction created and dispatching to gateway',
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
            }));
            const paymentTransaction = this.buildPaymentTransactionRowFromCreateDtoOut(createPaymentTransactionDtoOut);
            const gatewayRecurringDtoOut = await this.dispatchGatewayRecurringPaymentService.exec(new gateway_recurring_payment_dto_in_1.GatewayRecurringPaymentDtoIn({
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
            }));
            const updatedPaymentTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: paymentTransaction._id,
                gatewayTransactionId: gatewayRecurringDtoOut.gatewayTransactionId,
                gatewayStatus: gatewayRecurringDtoOut.gatewayStatus,
                status: gatewayRecurringDtoOut.status,
                processStatus: gatewayRecurringDtoOut.processStatus,
                processMessage: gatewayRecurringDtoOut.processMessage,
                providerPayload: this.sanitizeSensitiveGatewayData(gatewayRecurringDtoOut.providerRequest),
                providerResponse: this.sanitizeSensitiveGatewayData(gatewayRecurringDtoOut.providerResponse),
                gatewayResponse: this.sanitizeSensitiveGatewayData(gatewayRecurringDtoOut.gatewayResponse),
                qrCode: gatewayRecurringDtoOut.qrCode,
                qrCodeBase64: gatewayRecurringDtoOut.qrCodeBase64,
                boletoUrl: gatewayRecurringDtoOut.boletoUrl,
                checkoutUrl: gatewayRecurringDtoOut.checkoutUrl ??
                    gatewayRecurringDtoOut.approvalUrl,
                paidAt: gatewayRecurringDtoOut.paidAt,
                authorizedAt: gatewayRecurringDtoOut.authorizedAt,
                canceledAt: gatewayRecurringDtoOut.canceledAt,
                failedAt: gatewayRecurringDtoOut.failedAt,
                refundedAt: gatewayRecurringDtoOut.refundedAt,
                expiresAt: gatewayRecurringDtoOut.expiresAt,
                source: 'ProcessRecurringPaymentUseCase.gatewayResponse',
            }));
            const updatedSubscriptionDtoOut = await this.updateSubscriptionService.exec(new update_subscription_dto_in_1.UpdateSubscriptionDtoIn(subscription._id, 1, periodEnd, subscription.startedAt, null, null, subscription.metadata, {
                ...(subscription.config ?? {}),
                gatewaySubscriptionId: gatewayRecurringDtoOut.gatewaySubscriptionId,
                gatewayPlanId: gatewayRecurringDtoOut.gatewayPlanId,
                checkoutUrl: gatewayRecurringDtoOut.checkoutUrl ??
                    gatewayRecurringDtoOut.approvalUrl,
            }, this.resolveSubscriptionStatus(gatewayRecurringDtoOut.status), 'ProcessRecurringPaymentUseCase.gatewayResponse'));
            const updatedInvoiceDtoOut = await this.updateSubscriptionInvoiceService.exec(new update_subscription_invoice_dto_in_1.UpdateSubscriptionInvoiceDtoIn(subscriptionInvoice._id, updatedPaymentTransactionDtoOut.paymentTransaction._id, gatewayRecurringDtoOut.gatewayInvoiceId ??
                gatewayRecurringDtoOut.gatewayTransactionId, this.nowAsIso(), 2, gatewayRecurringDtoOut.paidAt, subscriptionInvoice.metadata, subscriptionInvoice.config, this.resolveInvoiceStatus(gatewayRecurringDtoOut.status), 'ProcessRecurringPaymentUseCase.gatewayResponse'));
            const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                _id: checkoutSession._id,
                gatewayId: resolvedGateway._id,
                apiCredentialId: resolvedApiCredential._id,
                config: this.mergeCheckoutSessionRecurringConfig({
                    currentConfig: checkoutSession.config,
                    subscriptionPlanId: subscriptionPlan._id,
                    subscriptionId: updatedSubscriptionDtoOut.subscription._id,
                    subscriptionCycleId: subscriptionCycleDtoOut.subscriptionCycle._id,
                    subscriptionInvoiceId: updatedInvoiceDtoOut.subscriptionInvoice._id,
                    paymentTransactionId: updatedPaymentTransactionDtoOut.paymentTransaction._id,
                    gatewaySubscriptionId: gatewayRecurringDtoOut.gatewaySubscriptionId,
                    gatewayPlanId: gatewayRecurringDtoOut.gatewayPlanId,
                    checkoutUrl: gatewayRecurringDtoOut.checkoutUrl ??
                        gatewayRecurringDtoOut.approvalUrl,
                }),
                status: this.resolveCheckoutSessionStatus(gatewayRecurringDtoOut.status),
                source: 'ProcessRecurringPaymentUseCase.gatewayResponse',
            }));
            return new process_recurring_payment_dto_out_1.ProcessRecurringPaymentDtoOut(updatedSubscriptionDtoOut.subscription, subscriptionCycleDtoOut.subscriptionCycle, updatedInvoiceDtoOut.subscriptionInvoice, updatedPaymentTransactionDtoOut.paymentTransaction, updatedCheckoutSessionDtoOut.checkoutSession);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
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
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on process recurring payment use case';
            throw new Error(message);
        }
    }
    resolveInitialNextBillingAt(trialDays) {
        const date = new Date();
        if (trialDays !== null && trialDays > 0) {
            date.setDate(date.getDate() + trialDays);
        }
        return date.toISOString();
    }
    calculatePeriodEnd(startIso, interval, intervalCount) {
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
    buildInvoiceNumber(subscriptionId, cycleNumber) {
        const cleanSubscriptionId = subscriptionId.replace(/[^a-zA-Z0-9]/g, '');
        return `INV-${cleanSubscriptionId.slice(0, 12)}-${String(cycleNumber).padStart(6, '0')}`;
    }
    mergeCheckoutSessionRecurringConfig(params) {
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
    resolveSubscriptionStatus(gatewayStatus) {
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
    resolveInvoiceStatus(gatewayStatus) {
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
    resolveCheckoutSessionStatus(gatewayStatus) {
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
    validatePaymentMethod(paymentMethod) {
        const allowedPaymentMethods = [
            'credit_card',
            'debit_card',
            'pix',
            'boleto',
            'payment_link',
        ];
        if (!allowedPaymentMethods.includes(paymentMethod)) {
            throw new Error(`paymentMethod must be one of: ${allowedPaymentMethods.join(', ')}`);
        }
    }
    assertNoForbiddenRawCardData(paymentData) {
        if (paymentData === null) {
            return;
        }
        const forbiddenKeys = [
            'cardNumber',
            'card_number',
            'number',
            'cvv',
            'securityCode',
            'security_code',
            'pan',
            'rawCard',
            'raw_card',
        ];
        for (const [key, value] of Object.entries(paymentData)) {
            if (forbiddenKeys.includes(key)) {
                throw new Error(`forbidden sensitive payment field: paymentData.${key}`);
            }
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                this.assertNoForbiddenRawCardData(value);
            }
        }
    }
    assertNoSensitiveFields(data, path) {
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
                this.assertNoSensitiveFields(value, `${path}.${key}`);
            }
        }
    }
    sanitizeSensitiveGatewayData(data) {
        if (data === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownGatewayValue(data);
        if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) {
            return null;
        }
        return sanitized;
    }
    sanitizeUnknownGatewayValue(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeUnknownGatewayValue(item));
        }
        if (value && typeof value === 'object') {
            const sanitizedObject = {};
            for (const [key, itemValue] of Object.entries(value)) {
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
    isSensitiveGatewayKey(key) {
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
    asObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        return value;
    }
    toRequiredString(value, message) {
        if (value === undefined || value === null || String(value).trim() === '') {
            throw new Error(message);
        }
        return String(value).trim();
    }
    nowAsIso() {
        return new Date().toISOString();
    }
    buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut) {
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
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    async resolveOrCreatePaymentCustomerId(params) {
        if (params.checkoutPaymentCustomerId !== null &&
            params.checkoutPaymentCustomerId.trim() !== '') {
            return params.checkoutPaymentCustomerId;
        }
        if (params.payer === null) {
            throw new Error('payer is required to create payment customer for recurring payment');
        }
        const name = this.toRequiredString(params.payer.name, 'payer.name is required');
        const email = this.toRequiredString(params.payer.email, 'payer.email is required');
        const documentType = this.toRequiredString(params.payer.documentType, 'payer.documentType is required');
        const documentValue = this.toRequiredString(params.payer.documentValue, 'payer.documentValue is required');
        const phoneNumber = this.toNullableString(params.payer.phoneNumber);
        const createPaymentCustomerDtoOut = await this.createPaymentCustomerService.exec(new create_payment_customer_dto_in_1.CreatePaymentCustomerDtoIn({
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
        }));
        return createPaymentCustomerDtoOut._id;
    }
};
exports.ProcessRecurringPaymentUseCase = ProcessRecurringPaymentUseCase;
exports.ProcessRecurringPaymentUseCase = ProcessRecurringPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_checkout_session_by_unique_id_service_1.FindCheckoutSessionByUniqueIdService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
        create_payment_customer_service_1.CreatePaymentCustomerService,
        create_subscription_service_1.CreateSubscriptionService,
        update_subscription_service_1.UpdateSubscriptionService,
        create_subscription_cycle_service_1.CreateSubscriptionCycleService,
        create_subscription_invoice_service_1.CreateSubscriptionInvoiceService,
        update_subscription_invoice_service_1.UpdateSubscriptionInvoiceService,
        create_payment_transaction_service_1.CreatePaymentTransactionService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
        dispatch_gateway_recurring_payment_service_1.DispatchGatewayRecurringPaymentService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessRecurringPaymentUseCase);
//# sourceMappingURL=process-recurring-payment.use-case.js.map