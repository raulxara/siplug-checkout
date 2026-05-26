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
exports.RegisterCheckoutSessionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const create_checkout_session_item_dto_in_1 = require("../../modules/checkout-sessions/services/create-checkout-session-item/dtos/create-checkout-session-item.dto-in");
const create_checkout_session_item_service_1 = require("../../modules/checkout-sessions/services/create-checkout-session-item/create-checkout-session-item.service");
const create_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/create-checkout-session/dtos/create-checkout-session.dto-in");
const create_checkout_session_service_1 = require("../../modules/checkout-sessions/services/create-checkout-session/create-checkout-session.service");
const update_checkout_session_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session/dtos/update-checkout-session.dto-in");
const update_checkout_session_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service");
const find_gateway_by_unique_id_dto_in_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in");
const find_gateway_by_unique_id_service_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_customer_by_unique_id_dto_in_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in");
const find_payment_customer_by_unique_id_service_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_checkout_session_dto_out_1 = require("./dtos/register-checkout-session.dto-out");
let RegisterCheckoutSessionUseCase = class RegisterCheckoutSessionUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findPaymentCustomerByUniqueIdService;
    findGatewayByUniqueIdService;
    findApiCredentialByUniqueIdService;
    createCheckoutSessionService;
    updateCheckoutSessionService;
    createCheckoutSessionItemService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, findClientByUniqueIdService, findPaymentCustomerByUniqueIdService, findGatewayByUniqueIdService, findApiCredentialByUniqueIdService, createCheckoutSessionService, updateCheckoutSessionService, createCheckoutSessionItemService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.createCheckoutSessionService = createCheckoutSessionService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.createCheckoutSessionItemService = createCheckoutSessionItemService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        let createdCheckoutSessionId = null;
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerCheckoutSession',
                requiredEntity: 'checkout_sessions',
            }));
            this.validatePaymentType(dtoIn.paymentType);
            this.validateItemsTotal(dtoIn.amount, dtoIn.items);
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(dtoIn.clientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== dtoIn.officeId) {
                throw new Error('client does not belong to office');
            }
            if (dtoIn.paymentCustomerId !== null) {
                const paymentCustomerDtoOut = await this.findPaymentCustomerByUniqueIdService.exec(new find_payment_customer_by_unique_id_dto_in_1.FindPaymentCustomerByUniqueIdDtoIn(dtoIn.paymentCustomerId));
                const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;
                if (paymentCustomer.status !== 'active') {
                    throw new Error('payment customer is not active');
                }
                if (paymentCustomer.officeId !== dtoIn.officeId) {
                    throw new Error('payment customer does not belong to office');
                }
                if (paymentCustomer.clientId !== dtoIn.clientId) {
                    throw new Error('payment customer does not belong to client');
                }
            }
            const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(dtoIn.gatewayId));
            const gateway = gatewayDtoOut.gateway;
            if (gateway.status !== 'active') {
                throw new Error('gateway is not active');
            }
            if (dtoIn.apiCredentialId !== null) {
                const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId));
                const apiCredential = apiCredentialDtoOut.apiCredential;
                if (apiCredential.status !== 'active') {
                    throw new Error('api credential is not active');
                }
                if (apiCredential.gatewayId !== null &&
                    apiCredential.gatewayId !== dtoIn.gatewayId) {
                    throw new Error('api credential does not belong to gateway');
                }
            }
            this.validateGatewayCapabilities({
                paymentType: dtoIn.paymentType,
                gatewayConfig: gateway.config,
            });
            const checkoutSessionDtoOut = await this.createCheckoutSessionService.exec(new create_checkout_session_dto_in_1.CreateCheckoutSessionDtoIn({
                officeId: dtoIn.officeId,
                clientId: dtoIn.clientId,
                paymentCustomerId: dtoIn.paymentCustomerId,
                gatewayId: dtoIn.gatewayId,
                apiCredentialId: dtoIn.apiCredentialId,
                code: dtoIn.code,
                externalReference: dtoIn.externalReference,
                idempotencyKey: dtoIn.idempotencyKey,
                paymentType: dtoIn.paymentType,
                amount: dtoIn.amount,
                currency: dtoIn.currency,
                description: dtoIn.description,
                successUrl: dtoIn.successUrl,
                cancelUrl: dtoIn.cancelUrl,
                expiresAt: dtoIn.expiresAt,
                metadata: {
                    ...(dtoIn.metadata ?? {}),
                    gatewaySlug: gateway.slug,
                    gatewayProvider: gateway.provider,
                    source: 'RegisterCheckoutSessionUseCase',
                },
                config: dtoIn.config,
                status: dtoIn.status,
            }));
            createdCheckoutSessionId = checkoutSessionDtoOut._id;
            const createdItems = [];
            for (const item of dtoIn.items) {
                const quantity = item.quantity ?? 1;
                const unitAmount = Number(item.unitAmount);
                const totalAmount = Number(item.totalAmount ?? quantity * unitAmount);
                const itemDtoOut = await this.createCheckoutSessionItemService.exec(new create_checkout_session_item_dto_in_1.CreateCheckoutSessionItemDtoIn({
                    checkoutSessionId: checkoutSessionDtoOut._id,
                    itemRef: item.itemRef ?? null,
                    itemType: item.itemType ?? null,
                    name: item.name,
                    description: item.description ?? null,
                    quantity,
                    unitAmount,
                    totalAmount,
                    metadata: item.metadata ?? null,
                    config: item.config ?? null,
                    status: item.status ?? 'active',
                }));
                createdItems.push({
                    id: itemDtoOut.id,
                    _id: itemDtoOut._id,
                    checkoutSessionId: itemDtoOut.checkoutSessionId,
                    itemRef: itemDtoOut.itemRef,
                    itemType: itemDtoOut.itemType,
                    name: itemDtoOut.name,
                    description: itemDtoOut.description,
                    quantity: itemDtoOut.quantity,
                    unitAmount: itemDtoOut.unitAmount,
                    totalAmount: itemDtoOut.totalAmount,
                    metadata: itemDtoOut.metadata,
                    config: itemDtoOut.config,
                    changesHistory: itemDtoOut.changesHistory,
                    status: itemDtoOut.status,
                    createdAt: itemDtoOut.createdAt,
                    updatedAt: itemDtoOut.updatedAt,
                });
            }
            return new register_checkout_session_dto_out_1.RegisterCheckoutSessionDtoOut({
                id: checkoutSessionDtoOut.id,
                _id: checkoutSessionDtoOut._id,
                officeId: checkoutSessionDtoOut.officeId,
                clientId: checkoutSessionDtoOut.clientId,
                paymentCustomerId: checkoutSessionDtoOut.paymentCustomerId,
                gatewayId: checkoutSessionDtoOut.gatewayId,
                apiCredentialId: checkoutSessionDtoOut.apiCredentialId,
                code: checkoutSessionDtoOut.code,
                externalReference: checkoutSessionDtoOut.externalReference,
                idempotencyKey: checkoutSessionDtoOut.idempotencyKey,
                paymentType: checkoutSessionDtoOut.paymentType,
                amount: checkoutSessionDtoOut.amount,
                currency: checkoutSessionDtoOut.currency,
                description: checkoutSessionDtoOut.description,
                successUrl: checkoutSessionDtoOut.successUrl,
                cancelUrl: checkoutSessionDtoOut.cancelUrl,
                expiresAt: checkoutSessionDtoOut.expiresAt,
                metadata: checkoutSessionDtoOut.metadata,
                config: checkoutSessionDtoOut.config,
                changesHistory: checkoutSessionDtoOut.changesHistory,
                status: checkoutSessionDtoOut.status,
                createdAt: checkoutSessionDtoOut.createdAt,
                updatedAt: checkoutSessionDtoOut.updatedAt,
            }, createdItems);
        }
        catch (error) {
            if (createdCheckoutSessionId !== null) {
                await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                    _id: createdCheckoutSessionId,
                    status: 'failed',
                    source: 'RegisterCheckoutSessionUseCase.rollback',
                }));
            }
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterCheckoutSessionUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    paymentCustomerId: dtoIn.paymentCustomerId,
                    gatewayId: dtoIn.gatewayId,
                    apiCredentialId: dtoIn.apiCredentialId,
                    externalReference: dtoIn.externalReference,
                    idempotencyKey: dtoIn.idempotencyKey,
                    paymentType: dtoIn.paymentType,
                    amount: dtoIn.amount,
                    currency: dtoIn.currency,
                    itemsTotal: dtoIn.items.length,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register checkout session use case';
            throw new Error(message);
        }
    }
    validatePaymentType(paymentType) {
        const allowedPaymentTypes = ['one_time', 'installment', 'recurring'];
        if (!allowedPaymentTypes.includes(paymentType)) {
            throw new Error(`paymentType must be one of: ${allowedPaymentTypes.join(', ')}`);
        }
    }
    validateItemsTotal(amount, items) {
        const calculatedTotal = items.reduce((total, item) => {
            const quantity = item.quantity ?? 1;
            const unitAmount = Number(item.unitAmount);
            const totalAmount = Number(item.totalAmount ?? quantity * unitAmount);
            return total + totalAmount;
        }, 0);
        if (calculatedTotal !== amount) {
            throw new Error('checkout session amount does not match items total');
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
    }
};
exports.RegisterCheckoutSessionUseCase = RegisterCheckoutSessionUseCase;
exports.RegisterCheckoutSessionUseCase = RegisterCheckoutSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
        find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        create_checkout_session_service_1.CreateCheckoutSessionService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        create_checkout_session_item_service_1.CreateCheckoutSessionItemService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterCheckoutSessionUseCase);
//# sourceMappingURL=register-checkout-session.use-case.js.map