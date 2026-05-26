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
exports.UpdateCheckoutSessionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_api_credential_by_unique_id_dto_in_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in");
const find_api_credential_by_unique_id_service_1 = require("../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_checkout_session_by_unique_id_dto_in_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/dtos/find-checkout-session-by-unique-id.dto-in");
const find_checkout_session_by_unique_id_service_1 = require("../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service");
const get_all_checkout_session_items_by_checkout_session_id_dto_in_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in");
const get_all_checkout_session_items_by_checkout_session_id_service_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service");
const update_checkout_session_item_dto_in_1 = require("../../modules/checkout-sessions/services/update-checkout-session-item/dtos/update-checkout-session-item.dto-in");
const update_checkout_session_item_service_1 = require("../../modules/checkout-sessions/services/update-checkout-session-item/update-checkout-session-item.service");
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
const update_checkout_session_dto_out_1 = require("./dtos/update-checkout-session.dto-out");
let UpdateCheckoutSessionUseCase = class UpdateCheckoutSessionUseCase {
    resolveActorAuthorizationService;
    findCheckoutSessionByUniqueIdService;
    getAllCheckoutSessionItemsByCheckoutSessionIdService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findPaymentCustomerByUniqueIdService;
    findGatewayByUniqueIdService;
    findApiCredentialByUniqueIdService;
    updateCheckoutSessionService;
    updateCheckoutSessionItemService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findCheckoutSessionByUniqueIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService, findOfficeByUniqueIdService, findClientByUniqueIdService, findPaymentCustomerByUniqueIdService, findGatewayByUniqueIdService, findApiCredentialByUniqueIdService, updateCheckoutSessionService, updateCheckoutSessionItemService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findCheckoutSessionByUniqueIdService = findCheckoutSessionByUniqueIdService;
        this.getAllCheckoutSessionItemsByCheckoutSessionIdService = getAllCheckoutSessionItemsByCheckoutSessionIdService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.findApiCredentialByUniqueIdService = findApiCredentialByUniqueIdService;
        this.updateCheckoutSessionService = updateCheckoutSessionService;
        this.updateCheckoutSessionItemService = updateCheckoutSessionItemService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updateCheckoutSession',
                requiredEntity: 'checkout_sessions',
            }));
            const currentSessionDtoOut = await this.findCheckoutSessionByUniqueIdService.exec(new find_checkout_session_by_unique_id_dto_in_1.FindCheckoutSessionByUniqueIdDtoIn(dtoIn.checkoutSessionId));
            const currentSession = currentSessionDtoOut.checkoutSession;
            const effectiveOfficeId = dtoIn.officeId ?? currentSession.officeId;
            const effectiveClientId = dtoIn.clientId ?? currentSession.clientId;
            const effectivePaymentCustomerId = dtoIn.paymentCustomerId ?? currentSession.paymentCustomerId;
            const effectiveGatewayId = dtoIn.gatewayId ?? currentSession.gatewayId;
            const effectiveApiCredentialId = dtoIn.apiCredentialId ?? currentSession.apiCredentialId;
            const effectivePaymentType = dtoIn.paymentType ?? currentSession.paymentType;
            const effectiveAmount = dtoIn.amount ?? currentSession.amount;
            this.validatePaymentType(effectivePaymentType);
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(effectiveOfficeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(effectiveClientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== effectiveOfficeId) {
                throw new Error('client does not belong to office');
            }
            if (effectivePaymentCustomerId !== null) {
                const paymentCustomerDtoOut = await this.findPaymentCustomerByUniqueIdService.exec(new find_payment_customer_by_unique_id_dto_in_1.FindPaymentCustomerByUniqueIdDtoIn(effectivePaymentCustomerId));
                const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;
                if (paymentCustomer.status !== 'active') {
                    throw new Error('payment customer is not active');
                }
                if (paymentCustomer.officeId !== effectiveOfficeId) {
                    throw new Error('payment customer does not belong to office');
                }
                if (paymentCustomer.clientId !== effectiveClientId) {
                    throw new Error('payment customer does not belong to client');
                }
            }
            const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(effectiveGatewayId));
            const gateway = gatewayDtoOut.gateway;
            if (gateway.status !== 'active') {
                throw new Error('gateway is not active');
            }
            if (effectiveApiCredentialId !== null) {
                const apiCredentialDtoOut = await this.findApiCredentialByUniqueIdService.exec(new find_api_credential_by_unique_id_dto_in_1.FindApiCredentialByUniqueIdDtoIn(effectiveApiCredentialId));
                const apiCredential = apiCredentialDtoOut.apiCredential;
                if (apiCredential.status !== 'active') {
                    throw new Error('api credential is not active');
                }
                if (apiCredential.gatewayId !== null &&
                    apiCredential.gatewayId !== effectiveGatewayId) {
                    throw new Error('api credential does not belong to gateway');
                }
            }
            this.validateGatewayCapabilities({
                paymentType: effectivePaymentType,
                gatewayConfig: gateway.config,
            });
            const currentItemsDtoOut = await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(new get_all_checkout_session_items_by_checkout_session_id_dto_in_1.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(currentSession._id));
            this.validateFinalItemsTotal({
                effectiveAmount,
                currentItems: currentItemsDtoOut.items,
                itemUpdates: dtoIn.items,
            });
            const updatedSessionDtoOut = await this.updateCheckoutSessionService.exec(new update_checkout_session_dto_in_1.UpdateCheckoutSessionDtoIn({
                _id: dtoIn.checkoutSessionId,
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
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            for (const item of dtoIn.items) {
                const currentItem = currentItemsDtoOut.items.find((row) => row._id === item.checkoutSessionItemId);
                if (!currentItem) {
                    throw new Error('checkout session item not found in current session');
                }
                const quantity = item.quantity ?? currentItem.quantity;
                const unitAmount = item.unitAmount ?? currentItem.unitAmount;
                const totalAmount = item.totalAmount ??
                    (item.quantity !== undefined || item.unitAmount !== undefined
                        ? quantity * unitAmount
                        : null);
                await this.updateCheckoutSessionItemService.exec(new update_checkout_session_item_dto_in_1.UpdateCheckoutSessionItemDtoIn({
                    _id: item.checkoutSessionItemId,
                    checkoutSessionId: null,
                    itemRef: item.itemRef ?? null,
                    itemType: item.itemType ?? null,
                    name: item.name ?? null,
                    description: item.description ?? null,
                    quantity: item.quantity ?? null,
                    unitAmount: item.unitAmount ?? null,
                    totalAmount,
                    metadata: item.metadata ?? null,
                    config: item.config ?? null,
                    status: item.status ?? null,
                    source: dtoIn.source,
                }));
            }
            const updatedItemsDtoOut = await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(new get_all_checkout_session_items_by_checkout_session_id_dto_in_1.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(currentSession._id));
            return new update_checkout_session_dto_out_1.UpdateCheckoutSessionDtoOut(updatedSessionDtoOut.checkoutSession, updatedItemsDtoOut.items);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdateCheckoutSessionUseCase',
                error,
                appFile: __filename,
                context: {
                    checkoutSessionId: dtoIn.checkoutSessionId,
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    paymentCustomerId: dtoIn.paymentCustomerId,
                    gatewayId: dtoIn.gatewayId,
                    apiCredentialId: dtoIn.apiCredentialId,
                    paymentType: dtoIn.paymentType,
                    amount: dtoIn.amount,
                    currency: dtoIn.currency,
                    itemsToUpdateTotal: dtoIn.items.length,
                    status: dtoIn.status,
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update checkout session use case';
            throw new Error(message);
        }
    }
    validatePaymentType(paymentType) {
        const allowedPaymentTypes = ['one_time', 'installment', 'recurring'];
        if (!allowedPaymentTypes.includes(paymentType)) {
            throw new Error(`paymentType must be one of: ${allowedPaymentTypes.join(', ')}`);
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
    validateFinalItemsTotal(params) {
        if (params.currentItems.length === 0) {
            throw new Error('checkout session must have at least one item');
        }
        const simulatedItemsById = new Map();
        for (const item of params.currentItems) {
            simulatedItemsById.set(item._id, { ...item });
        }
        for (const update of params.itemUpdates) {
            const currentItem = simulatedItemsById.get(update.checkoutSessionItemId);
            if (!currentItem) {
                throw new Error('checkout session item not found in current session');
            }
            const quantity = update.quantity ?? currentItem.quantity;
            const unitAmount = update.unitAmount ?? currentItem.unitAmount;
            const totalAmount = update.totalAmount ??
                (update.quantity !== undefined || update.unitAmount !== undefined
                    ? quantity * unitAmount
                    : currentItem.totalAmount);
            simulatedItemsById.set(update.checkoutSessionItemId, {
                ...currentItem,
                itemRef: update.itemRef ?? currentItem.itemRef,
                itemType: update.itemType ?? currentItem.itemType,
                name: update.name ?? currentItem.name,
                description: update.description ?? currentItem.description,
                quantity,
                unitAmount,
                totalAmount,
                metadata: update.metadata ?? currentItem.metadata,
                config: update.config ?? currentItem.config,
                status: update.status ?? currentItem.status,
            });
        }
        const calculatedTotal = Array.from(simulatedItemsById.values())
            .filter((item) => item.status === 'active')
            .reduce((total, item) => total + item.totalAmount, 0);
        if (calculatedTotal !== params.effectiveAmount) {
            throw new Error('checkout session amount does not match active items total');
        }
    }
};
exports.UpdateCheckoutSessionUseCase = UpdateCheckoutSessionUseCase;
exports.UpdateCheckoutSessionUseCase = UpdateCheckoutSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_checkout_session_by_unique_id_service_1.FindCheckoutSessionByUniqueIdService,
        get_all_checkout_session_items_by_checkout_session_id_service_1.GetAllCheckoutSessionItemsByCheckoutSessionIdService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
        find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        find_api_credential_by_unique_id_service_1.FindApiCredentialByUniqueIdService,
        update_checkout_session_service_1.UpdateCheckoutSessionService,
        update_checkout_session_item_service_1.UpdateCheckoutSessionItemService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdateCheckoutSessionUseCase);
//# sourceMappingURL=update-checkout-session.use-case.js.map