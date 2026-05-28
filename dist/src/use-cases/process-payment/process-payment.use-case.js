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
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findCheckoutSessionByUniqueIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService, updateCheckoutSessionService, findOfficeByUniqueIdService, findClientByUniqueIdService, findPaymentCustomerByUniqueIdService, resolvePaymentGatewayCredentialService, dispatchGatewayPaymentService, createPaymentTransactionService, updatePaymentTransactionService, handleUseCaseExceptionService) {
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
            }));
            const resolvedGateway = resolvedGatewayCredentialDtoOut.gateway;
            const resolvedApiCredential = resolvedGatewayCredentialDtoOut.apiCredential;
            const rawProviderPayload = {
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
            }));
            const createdPaymentTransaction = this.buildPaymentTransactionRowFromCreateDtoOut(transactionDtoOut);
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
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessPaymentUseCase);
//# sourceMappingURL=process-payment.use-case.js.map