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
exports.ProcessPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_checkout_session_items_by_checkout_session_id_dto_in_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in");
const get_all_checkout_session_items_by_checkout_session_id_service_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service");
const find_checkout_session_by_unique_id_dto_in_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in");
const find_checkout_session_by_unique_id_service_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const gateway_payment_dto_in_1 = require("../../modules/gateway-orchestration/dtos/gateway-payment.dto-in");
const dispatch_gateway_payment_service_1 = require("../../modules/gateway-orchestration/services/dispatch-gateway-payment/dispatch-gateway-payment.service");
const resolve_payment_gateway_credential_dto_in_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/dtos/resolve-payment-gateway-credential.dto-in");
const resolve_payment_gateway_credential_service_1 = require("../../modules/gateway-orchestration/services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_customer_by_unique_id_dto_in_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in");
const find_payment_customer_by_unique_id_service_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const create_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in");
const create_payment_transaction_service_1 = require("../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service");
const update_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/update-payment-transaction/dtos/update-payment-transaction.dto-in");
const update_payment_transaction_service_1 = require("../../modules/payment-transactions/services/update-payment-transaction/update-payment-transaction.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const process_payment_dto_out_1 = require("./dtos/process-payment.dto-out");
const create_payment_split_recipient_dto_in_1 = require("../../modules/payment-split-recipients/services/create-payment-split-recipient/dtos/create-payment-split-recipient.dto-in");
const create_payment_split_recipient_service_1 = require("../../modules/payment-split-recipients/services/create-payment-split-recipient/create-payment-split-recipient.service");
const create_payment_split_dto_in_1 = require("../../modules/payment-splits/services/create-payment-split/dtos/create-payment-split.dto-in");
const create_payment_split_service_1 = require("../../modules/payment-splits/services/create-payment-split/create-payment-split.service");
const update_payment_split_dto_in_1 = require("../../modules/payment-splits/services/update-payment-split/dtos/update-payment-split.dto-in");
const update_payment_split_service_1 = require("../../modules/payment-splits/services/update-payment-split/update-payment-split.service");
const calculate_payment_split_dto_in_1 = require("../../modules/split-calculations/services/calculate-payment-split/dtos/calculate-payment-split.dto-in");
const calculate_payment_split_service_1 = require("../../modules/split-calculations/services/calculate-payment-split/calculate-payment-split.service");
let ProcessPaymentUseCase = class ProcessPaymentUseCase {
    resolveActorAuthorizationService;
    findCheckoutSessionByUniqueIdService;
    getAllCheckoutSessionItemsByCheckoutSessionIdService;
    updateCheckoutSessionService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findPaymentCustomerByUniqueIdService;
    resolvePaymentGatewayCredentialService;
    dispatchGatewayPaymentService;
    createPaymentTransactionService;
    updatePaymentTransactionService;
    calculatePaymentSplitService;
    createPaymentSplitService;
    updatePaymentSplitService;
    createPaymentSplitRecipientService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findCheckoutSessionByUniqueIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService, updateCheckoutSessionService, findOfficeByUniqueIdService, findClientByUniqueIdService, findPaymentCustomerByUniqueIdService, resolvePaymentGatewayCredentialService, dispatchGatewayPaymentService, createPaymentTransactionService, updatePaymentTransactionService, calculatePaymentSplitService, createPaymentSplitService, updatePaymentSplitService, createPaymentSplitRecipientService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findCheckoutSessionByUniqueIdService = findCheckoutSessionByUniqueIdService;
        this.getAllCheckoutSessionItemsByCheckoutSessionIdService = getAllCheckoutSessionItemsByCheckoutSessionIdService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.resolvePaymentGatewayCredentialService = resolvePaymentGatewayCredentialService;
        this.dispatchGatewayPaymentService = dispatchGatewayPaymentService;
        this.createPaymentTransactionService = createPaymentTransactionService;
        this.updatePaymentTransactionService = updatePaymentTransactionService;
        this.calculatePaymentSplitService = calculatePaymentSplitService;
        this.createPaymentSplitService = createPaymentSplitService;
        this.updatePaymentSplitService = updatePaymentSplitService;
        this.createPaymentSplitRecipientService = createPaymentSplitRecipientService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'processPayment',
                requiredEntity: 'payment_transactions',
            }));
            this.validatePaymentMethod(dtoIn.paymentMethod);
            this.assertNoForbiddenSensitivePaymentData({
                payer: dtoIn.payer,
                paymentData: dtoIn.paymentData,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
            });
            const checkoutSessionDtoOut = await this.findCheckoutSessionByUniqueIdService.exec(new find_checkout_session_by_unique_id_dto_in_1.FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId));
            const checkoutSession = checkoutSessionDtoOut.checkoutSession;
            if (!['created', 'processing'].includes(checkoutSession.status)) {
                throw new Error('checkout session is not available for payment');
            }
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(checkoutSession.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(checkoutSession.clientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== checkoutSession.officeId) {
                throw new Error('client does not belong to office');
            }
            if (checkoutSession.paymentCustomerId !== null) {
                const paymentCustomerDtoOut = await this.findPaymentCustomerByUniqueIdService.exec(new find_payment_customer_by_unique_id_dto_in_1.FindPaymentCustomerByUniqueIdDtoIn(checkoutSession.paymentCustomerId));
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
            const itemsDtoOut = await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(new get_all_checkout_session_items_by_checkout_session_id_dto_in_1.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(checkoutSession._id));
            const activeItems = itemsDtoOut.items.filter((item) => item.status === 'active');
            if (activeItems.length === 0) {
                throw new Error('checkout session must have at least one active item');
            }
            const activeItemsTotal = activeItems.reduce((total, item) => total + item.totalAmount, 0);
            if (activeItemsTotal !== checkoutSession.amount) {
                throw new Error('checkout session amount does not match active items total');
            }
            const resolvedGatewayCredentialDtoOut = await this.resolvePaymentGatewayCredentialService.exec(new resolve_payment_gateway_credential_dto_in_1.ResolvePaymentGatewayCredentialDtoIn({
                officeId: checkoutSession.officeId,
                clientId: checkoutSession.clientId,
                paymentType: checkoutSession.paymentType,
                paymentMethod: dtoIn.paymentMethod,
                gatewayProvider: dtoIn.gatewayProvider,
                gatewaySlug: dtoIn.gatewaySlug,
                gatewayId: dtoIn.gatewayId ?? checkoutSession.gatewayId,
                apiCredentialId: dtoIn.apiCredentialId ?? checkoutSession.apiCredentialId,
            }));
            const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
            const resolvedApiCredential = resolvedGatewayCredentialDtoOut.apiCredential;
            this.assertResolvedGatewayMatchesCheckoutSession({
                checkoutSession,
                resolvedGateway,
                resolvedApiCredential,
            });
            let rawProviderPayload = {
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
            const sanitizedProviderPayload = this.sanitizeSensitiveGatewayData(rawProviderPayload);
            const splitRequired = this.resolveSplitRequired(checkoutSession.config, dtoIn.config);
            const transactionDtoOut = await this.createPaymentTransactionService.exec(new create_payment_transaction_dto_in_1.CreatePaymentTransactionDtoIn({
                officeId: checkoutSession.officeId,
                clientId: checkoutSession.clientId,
                checkoutSessionId: checkoutSession._id,
                paymentCustomerId: checkoutSession.paymentCustomerId,
                gatewayId: resolvedGateway._id,
                apiCredentialId: resolvedApiCredential._id,
                gatewayTransactionId: null,
                externalReference: dtoIn.externalReference ?? checkoutSession.externalReference,
                idempotencyKey: dtoIn.idempotencyKey ?? checkoutSession.idempotencyKey,
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
                processMessage: 'payment transaction created and dispatching to gateway',
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
            }));
            let createdPaymentTransaction = this.buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut);
            const paymentSplitSnapshot = await this.registerPaymentSplitForTransaction({
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
                const updatedWithSplitDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                    _id: createdPaymentTransaction._id,
                    hasSplit: true,
                    providerPayload: this.sanitizeSensitiveGatewayData(rawProviderPayload),
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
                }));
                createdPaymentTransaction = updatedWithSplitDtoOut.paymentTransaction;
            }
            const gatewayPaymentDtoOut = await this.dispatchGatewayPaymentService.exec(new gateway_payment_dto_in_1.GatewayPaymentDtoIn({
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
            }));
            await this.persistPagSeguroGatewaySplitId({
                paymentSplitSnapshot,
                gatewayProvider: resolvedGateway.provider,
                providerResponse: gatewayPaymentDtoOut.providerResponse,
            });
            const updatedTransactionDtoOut = await this.updatePaymentTransactionService.exec(new update_payment_transaction_dto_in_1.UpdatePaymentTransactionDtoIn({
                _id: createdPaymentTransaction._id,
                gatewayTransactionId: gatewayPaymentDtoOut.gatewayTransactionId,
                gatewayStatus: gatewayPaymentDtoOut.gatewayStatus,
                status: gatewayPaymentDtoOut.status,
                processStatus: gatewayPaymentDtoOut.processStatus,
                processMessage: gatewayPaymentDtoOut.processMessage,
                providerPayload: this.sanitizeSensitiveGatewayData(gatewayPaymentDtoOut.providerRequest),
                providerResponse: this.sanitizeSensitiveGatewayData(gatewayPaymentDtoOut.providerResponse),
                gatewayResponse: this.sanitizeSensitiveGatewayData(gatewayPaymentDtoOut.gatewayResponse),
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
            }));
            const checkoutSessionStatus = this.resolveCheckoutSessionStatus(updatedTransactionDtoOut.paymentTransaction.status);
            const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                _id: checkoutSession._id,
                status: checkoutSessionStatus,
                source: 'ProcessPaymentUseCase',
            }));
            return new process_payment_dto_out_1.ProcessPaymentDtoOut(updatedCheckoutSessionDtoOut.checkoutSession, updatedTransactionDtoOut.paymentTransaction);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
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
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on process payment use case';
            throw new Error(message);
        }
    }
    validatePaymentType(paymentType) {
        const allowedPaymentTypes = ['one_time', 'installment', 'recurring'];
        if (!allowedPaymentTypes.includes(paymentType)) {
            throw new Error(`paymentType must be one of: ${allowedPaymentTypes.join(', ')}`);
        }
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
    validateInstallments(params) {
        if (params.paymentType === 'installment') {
            if (params.paymentMethod !== 'credit_card') {
                throw new Error('installment payment requires credit_card method');
            }
            if (params.installments === null || params.installments < 2) {
                throw new Error('installments must be greater than or equal to 2 for installment payment');
            }
            if (params.installmentAmount === null) {
                throw new Error('installmentAmount is required for installment payment');
            }
            const expectedTotal = params.installmentAmount * params.installments +
                (params.interestAmount ?? 0);
            if (expectedTotal !== params.amount) {
                throw new Error('installmentAmount multiplied by installments plus interestAmount must match amount');
            }
            return;
        }
        if (params.installments !== null && params.installments > 1) {
            throw new Error('installments greater than 1 is allowed only for installment payment');
        }
    }
    sanitizeSensitiveGatewayData(data) {
        if (data === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownGatewayValue(data, new WeakSet());
        if (!sanitized ||
            typeof sanitized !== 'object' ||
            Array.isArray(sanitized)) {
            return null;
        }
        return sanitized;
    }
    sanitizeUnknownGatewayValue(value, seen, depth = 0) {
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
            const sanitizedArray = value.map((item) => this.sanitizeUnknownGatewayValue(item, seen, depth + 1));
            seen.delete(value);
            return sanitizedArray;
        }
        if (value && typeof value === 'object') {
            if (seen.has(value)) {
                return '[CIRCULAR]';
            }
            seen.add(value);
            const sanitizedObject = {};
            for (const [key, itemValue] of Object.entries(value)) {
                if (this.isSensitiveGatewayKey(key)) {
                    sanitizedObject[key] = '[REDACTED]';
                    continue;
                }
                sanitizedObject[key] = this.sanitizeUnknownGatewayValue(itemValue, seen, depth + 1);
            }
            seen.delete(value);
            return sanitizedObject;
        }
        return value;
    }
    isSensitiveGatewayKey(key) {
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
    assertNoForbiddenSensitivePaymentData(params) {
        this.assertNoForbiddenKeys(params.payer, 'payer');
        this.assertNoForbiddenKeys(params.paymentData, 'paymentData');
        this.assertNoForbiddenKeys(params.metadata, 'metadata');
        this.assertNoForbiddenKeys(params.config, 'config');
    }
    assertNoForbiddenKeys(data, path) {
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
                this.assertNoForbiddenKeys(value, `${path}.${key}`);
            }
        }
    }
    resolveCheckoutSessionStatus(paymentTransactionStatus) {
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
    resolveSplitRequired(checkoutSessionConfig, requestConfig) {
        const requestSplitRequired = this.getBooleanFromConfig(requestConfig, 'splitRequired');
        if (requestSplitRequired === false) {
            return false;
        }
        const requestSplitRuleId = this.getStringFromConfig(requestConfig, 'splitRuleId');
        if (requestSplitRuleId !== null) {
            return true;
        }
        if (requestSplitRequired === true) {
            throw new Error('splitRuleId is required when splitRequired is true');
        }
        const checkoutSessionSplitRuleId = this.getStringFromConfig(checkoutSessionConfig, 'splitRuleId');
        if (checkoutSessionSplitRuleId !== null) {
            return true;
        }
        return false;
    }
    async registerPaymentSplitForTransaction(params) {
        if (!params.paymentTransaction.splitRequired) {
            return null;
        }
        const splitRuleId = this.resolveSplitRuleId(params.checkoutSessionConfig, params.requestConfig);
        if (splitRuleId === null) {
            throw new Error('splitRuleId is required when splitRequired is true');
        }
        const calculation = await this.calculatePaymentSplitService.exec(new calculate_payment_split_dto_in_1.CalculatePaymentSplitDtoIn(splitRuleId, params.paymentTransaction.amount, null, null, params.paymentTransaction.currency, params.metadata));
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
        const paymentSplitDtoOut = await this.createPaymentSplitService.exec(new create_payment_split_dto_in_1.CreatePaymentSplitDtoIn(String(splitRule.officeId), String(splitRule.clientId), params.paymentTransaction.checkoutSessionId, params.paymentTransaction._id, null, null, splitRuleId, params.gatewayProvider, null, calculation.allocatedAmount, calculation.currency, null, null, null, params.metadata, paymentSplitConfig, 'created'));
        const paymentSplitRecipients = [];
        for (const recipient of calculation.recipients) {
            const recipientConfig = {
                ...(recipient.config ?? {}),
                splitRuleRecipientId: recipient.splitRuleRecipientId,
                fixedAmount: recipient.fixedAmount,
                liableForGatewayFee: recipient.liableForGatewayFee,
                liableForRefund: recipient.liableForRefund,
                priority: recipient.priority,
            };
            const paymentSplitRecipientDtoOut = await this.createPaymentSplitRecipientService.exec(new create_payment_split_recipient_dto_in_1.CreatePaymentSplitRecipientDtoIn(String(paymentSplitDtoOut.paymentSplit._id), recipient.splitRecipientId, this.resolveGatewayRecipientId(recipient.config, params.gatewayProvider), null, recipient.role, recipient.amount, recipient.percentage, recipient.currency, null, null, null, recipient.metadata, recipientConfig, 'created'));
            paymentSplitRecipients.push(paymentSplitRecipientDtoOut.paymentSplitRecipient);
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
    resolveSplitRuleId(checkoutSessionConfig, requestConfig) {
        const requestSplitRuleId = this.getStringFromConfig(requestConfig, 'splitRuleId');
        if (requestSplitRuleId !== null) {
            return requestSplitRuleId;
        }
        return this.getStringFromConfig(checkoutSessionConfig, 'splitRuleId');
    }
    async persistPagSeguroGatewaySplitId(params) {
        if (!this.isPagSeguroProvider(params.gatewayProvider)) {
            return;
        }
        const paymentSplitId = this.getStringFromConfig(params.paymentSplitSnapshot, 'paymentSplitId');
        const gatewaySplitId = this.extractPagSeguroSplitId(params.providerResponse);
        if (paymentSplitId === null || gatewaySplitId === null) {
            return;
        }
        await this.updatePaymentSplitService.exec(new update_payment_split_dto_in_1.UpdatePaymentSplitDtoIn({
            _id: paymentSplitId,
            gatewaySplitId,
            source: 'ProcessPaymentUseCase.persistPagSeguroGatewaySplitId',
        }));
    }
    extractPagSeguroSplitId(providerResponse) {
        const charges = Array.isArray(providerResponse?.charges)
            ? providerResponse.charges
            : [];
        for (const charge of charges) {
            if (!charge || typeof charge !== 'object' || Array.isArray(charge)) {
                continue;
            }
            const links = charge.links;
            if (!Array.isArray(links)) {
                continue;
            }
            for (const link of links) {
                if (!link || typeof link !== 'object' || Array.isArray(link)) {
                    continue;
                }
                const linkData = link;
                if (this.getStringFromConfig(linkData, 'rel') !== 'SPLIT') {
                    continue;
                }
                const href = this.getStringFromConfig(linkData, 'href');
                const splitId = href?.split('/').pop()?.trim() ?? null;
                if (splitId?.startsWith('SPLI_')) {
                    return splitId;
                }
            }
        }
        return null;
    }
    resolveGatewayRecipientId(recipientConfig, gatewayProvider) {
        if (recipientConfig === null) {
            return null;
        }
        const gatewayAccounts = recipientConfig.gatewayAccounts;
        if (gatewayAccounts &&
            typeof gatewayAccounts === 'object' &&
            !Array.isArray(gatewayAccounts)) {
            const normalizedGatewayProvider = gatewayProvider.trim().toLowerCase();
            const gatewayAccountKey = this.isPagSeguroProvider(gatewayProvider)
                ? 'pagseguro'
                : normalizedGatewayProvider;
            const account = gatewayAccounts[gatewayAccountKey];
            if (account && typeof account === 'object' && !Array.isArray(account)) {
                const accountId = this.getStringFromConfig(account, 'accountId');
                if (accountId !== null) {
                    return accountId;
                }
            }
        }
        return (this.getStringFromConfig(recipientConfig, 'gatewayRecipientId') ??
            this.getStringFromConfig(recipientConfig, 'stripeAccountId'));
    }
    isPagSeguroProvider(provider) {
        return ['pagseguro', 'pagbank', 'pag_bank', 'pag-seguro'].includes(provider.trim().toLowerCase());
    }
    getStringFromConfig(config, key) {
        if (config === null) {
            return null;
        }
        const value = config[key];
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean') {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    assertResolvedGatewayMatchesCheckoutSession(params) {
        if (params.checkoutSession.gatewayId !== null &&
            params.resolvedGateway._id !== params.checkoutSession.gatewayId) {
            throw new Error([
                'resolved gateway does not match checkout session gateway',
                `checkoutSessionId=${params.checkoutSession._id}`,
                `checkoutGatewayId=${params.checkoutSession.gatewayId}`,
                `resolvedGatewayId=${params.resolvedGateway._id}`,
                `resolvedGatewayProvider=${params.resolvedGateway.provider}`,
                `resolvedGatewaySlug=${params.resolvedGateway.slug}`,
            ].join(' | '));
        }
        if (params.checkoutSession.apiCredentialId !== null &&
            params.resolvedApiCredential._id !==
                params.checkoutSession.apiCredentialId) {
            throw new Error([
                'resolved api credential does not match checkout session api credential',
                `checkoutSessionId=${params.checkoutSession._id}`,
                `checkoutApiCredentialId=${params.checkoutSession.apiCredentialId}`,
                `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
                `resolvedApiCredentialSlug=${params.resolvedApiCredential.slug}`,
            ].join(' | '));
        }
        if (params.resolvedApiCredential.gatewayId === null) {
            throw new Error([
                'resolved api credential does not have gateway id',
                `resolvedGatewayId=${params.resolvedGateway._id}`,
                `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
                `resolvedApiCredentialSlug=${params.resolvedApiCredential.slug}`,
            ].join(' | '));
        }
        if (params.resolvedApiCredential.gatewayId !== params.resolvedGateway._id) {
            throw new Error([
                'resolved api credential does not belong to resolved gateway',
                `resolvedGatewayId=${params.resolvedGateway._id}`,
                `resolvedApiCredentialId=${params.resolvedApiCredential._id}`,
                `resolvedApiCredentialGatewayId=${params.resolvedApiCredential.gatewayId}`,
            ].join(' | '));
        }
    }
    getBooleanFromConfig(config, key) {
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
};
exports.ProcessPaymentUseCase = ProcessPaymentUseCase;
exports.ProcessPaymentUseCase = ProcessPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_checkout_session_by_unique_id_service_1.FindCheckoutSessionByUniqueIdService,
        get_all_checkout_session_items_by_checkout_session_id_service_1.GetAllCheckoutSessionItemsByCheckoutSessionIdService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
        resolve_payment_gateway_credential_service_1.ResolvePaymentGatewayCredentialService,
        dispatch_gateway_payment_service_1.DispatchGatewayPaymentService,
        create_payment_transaction_service_1.CreatePaymentTransactionService,
        update_payment_transaction_service_1.UpdatePaymentTransactionService,
        calculate_payment_split_service_1.CalculatePaymentSplitService,
        create_payment_split_service_1.CreatePaymentSplitService,
        update_payment_split_service_1.UpdatePaymentSplitService,
        create_payment_split_recipient_service_1.CreatePaymentSplitRecipientService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessPaymentUseCase);
//# sourceMappingURL=process-payment.use-case.js.map