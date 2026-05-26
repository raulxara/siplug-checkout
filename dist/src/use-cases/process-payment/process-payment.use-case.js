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
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const get_all_checkout_session_items_by_checkout_session_id_dto_in_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in");
const get_all_checkout_session_items_by_checkout_session_id_service_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service");
const find_checkout_session_by_unique_id_dto_in_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in");
const find_checkout_session_by_unique_id_service_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_gateway_by_unique_id_dto_in_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in");
const find_gateway_by_unique_id_service_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_customer_by_unique_id_dto_in_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in");
const find_payment_customer_by_unique_id_service_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const create_payment_transaction_dto_in_1 = require("../../modules/payment-transactions/services/create-payment-transaction/dtos/create-payment-transaction.dto-in");
const create_payment_transaction_service_1 = require("../../modules/payment-transactions/services/create-payment-transaction/create-payment-transaction.service");
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
    findGatewayByUniqueIdService;
    findApiCredentialByUniqueIdService;
    createPaymentTransactionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findCheckoutSessionByUniqueIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService, updateCheckoutSessionService, findOfficeByUniqueIdService, findClientByUniqueIdService, findPaymentCustomerByUniqueIdService, findGatewayByUniqueIdService, findApiCredentialByUniqueIdService, createPaymentTransactionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findCheckoutSessionByUniqueIdService = findCheckoutSessionByUniqueIdService;
        this.getAllCheckoutSessionItemsByCheckoutSessionIdService = getAllCheckoutSessionItemsByCheckoutSessionIdService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.createPaymentTransactionService = createPaymentTransactionService;
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
            if (checkoutSession.status !== 'created') {
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
            const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(checkoutSession.gatewayId));
            const gateway = gatewayDtoOut.gateway;
            if (gateway.status !== 'active') {
                throw new Error('gateway is not active');
            }
            if (checkoutSession.apiCredentialId !== null) {
                const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(checkoutSession.apiCredentialId));
                const apiCredential = apiCredentialDtoOut.apiCredential;
                if (apiCredential.status !== 'active') {
                    throw new Error('api credential is not active');
                }
                if (apiCredential.gatewayId !== null &&
                    apiCredential.gatewayId !== checkoutSession.gatewayId) {
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
            const itemsDtoOut = await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(new get_all_checkout_session_items_by_checkout_session_id_dto_in_1.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(checkoutSession._id));
            const activeItems = itemsDtoOut.items.filter((item) => item.status === 'active');
            if (activeItems.length === 0) {
                throw new Error('checkout session must have at least one active item');
            }
            const activeItemsTotal = activeItems.reduce((total, item) => total + item.totalAmount, 0);
            if (activeItemsTotal !== checkoutSession.amount) {
                throw new Error('checkout session amount does not match active items total');
            }
            const transactionDtoOut = await this.createPaymentTransactionService.exec(new create_payment_transaction_dto_in_1.CreatePaymentTransactionDtoIn({
                officeId: checkoutSession.officeId,
                clientId: checkoutSession.clientId,
                checkoutSessionId: checkoutSession._id,
                paymentCustomerId: checkoutSession.paymentCustomerId,
                gatewayId: checkoutSession.gatewayId,
                apiCredentialId: checkoutSession.apiCredentialId,
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
                processStatus: 'pending_gateway_dispatch',
                processMessage: 'payment transaction created and waiting gateway dispatch',
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
            }));
            const updatedCheckoutSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                _id: checkoutSession._id,
                status: 'processing',
                source: 'ProcessPaymentUseCase',
            }));
            return new process_payment_dto_out_1.ProcessPaymentDtoOut(updatedCheckoutSessionDtoOut.checkoutSession, {
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
            });
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
    validateGatewayCapabilities(params) {
        const config = params.gatewayConfig ?? {};
        if (params.paymentType === 'one_time' &&
            config.supportsOneTimePayment === false) {
            throw new Error('gateway does not support one time payment');
        }
        if (params.paymentType === 'installment' &&
            config.supportsInstallments === false) {
            throw new Error('gateway does not support installments');
        }
        if (params.paymentType === 'recurring' &&
            config.supportsRecurringPayment === false) {
            throw new Error('gateway does not support recurring payment');
        }
        const supportedPaymentMethods = config.supportedPaymentMethods;
        if (Array.isArray(supportedPaymentMethods)) {
            const normalizedMethods = supportedPaymentMethods.map((method) => String(method));
            if (!normalizedMethods.includes(params.paymentMethod)) {
                throw new Error('gateway does not support selected payment method');
            }
        }
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
        find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        create_payment_transaction_service_1.CreatePaymentTransactionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ProcessPaymentUseCase);
//# sourceMappingURL=process-payment.use-case.js.map