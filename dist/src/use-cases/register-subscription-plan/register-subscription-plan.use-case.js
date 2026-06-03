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
exports.RegisterSubscriptionPlanUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const create_subscription_plan_dto_in_1 = require("../../modules/subscription-plans/services/create-subscription-plan/dtos/create-subscription-plan.dto-in");
const create_subscription_plan_service_1 = require("../../modules/subscription-plans/services/create-subscription-plan/create-subscription-plan.service");
const find_subscription_plan_by_slug_and_office_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-slug-and-office-id/dtos/find-subscription-plan-by-slug-and-office-id.dto-in");
const find_subscription_plan_by_slug_and_office_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service");
const register_subscription_plan_dto_out_1 = require("./dtos/register-subscription-plan.dto-out");
let RegisterSubscriptionPlanUseCase = class RegisterSubscriptionPlanUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findSubscriptionPlanBySlugAndOfficeIdService;
    createSubscriptionPlanService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, findClientByUniqueIdService, findSubscriptionPlanBySlugAndOfficeIdService, createSubscriptionPlanService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findSubscriptionPlanBySlugAndOfficeIdService = findSubscriptionPlanBySlugAndOfficeIdService;
        this.createSubscriptionPlanService = createSubscriptionPlanService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerSubscriptionPlan',
                requiredEntity: 'subscription_plans',
            }));
            this.validateBillingInterval(dtoIn.billingInterval);
            this.validateStatus(dtoIn.status);
            this.validateCurrency(dtoIn.currency);
            this.validatePaymentMethods(dtoIn.paymentMethods);
            this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
            this.assertNoSensitiveFields(dtoIn.config, 'config');
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
            const existingSubscriptionPlanDtoOut = await this.findSubscriptionPlanBySlugAndOfficeIdService.exec(new find_subscription_plan_by_slug_and_office_id_dto_in_1.FindSubscriptionPlanBySlugAndOfficeIdDtoIn({
                slug: dtoIn.slug,
                officeId: dtoIn.officeId,
            }));
            if (existingSubscriptionPlanDtoOut.subscriptionPlan !== null) {
                throw new Error('subscription plan slug already exists for this office');
            }
            const createDtoOut = await this.createSubscriptionPlanService.exec(new create_subscription_plan_dto_in_1.CreateSubscriptionPlanDtoIn(dtoIn.officeId, dtoIn.clientId, dtoIn.gatewayId, dtoIn.apiCredentialId, null, dtoIn.name, dtoIn.slug, dtoIn.description, dtoIn.billingInterval, dtoIn.billingIntervalCount, dtoIn.amount, dtoIn.currency, dtoIn.trialDays, dtoIn.maxBillingCycles, dtoIn.paymentMethods, {
                ...(dtoIn.metadata ?? {}),
                source: 'RegisterSubscriptionPlanUseCase',
            }, dtoIn.config, dtoIn.status));
            return new register_subscription_plan_dto_out_1.RegisterSubscriptionPlanDtoOut(createDtoOut.subscriptionPlan);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterSubscriptionPlanUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    gatewayId: dtoIn.gatewayId,
                    apiCredentialId: dtoIn.apiCredentialId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    billingInterval: dtoIn.billingInterval,
                    billingIntervalCount: dtoIn.billingIntervalCount,
                    amount: dtoIn.amount,
                    currency: dtoIn.currency,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register subscription plan use case';
            throw new Error(message);
        }
    }
    validateBillingInterval(billingInterval) {
        const allowedIntervals = ['day', 'week', 'month', 'year'];
        if (!allowedIntervals.includes(billingInterval)) {
            throw new Error(`billingInterval must be one of: ${allowedIntervals.join(', ')}`);
        }
    }
    validateStatus(status) {
        const allowedStatuses = ['active', 'inactive', 'draft'];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
        }
    }
    validateCurrency(currency) {
        const allowedCurrencies = ['BRL', 'USD'];
        if (!allowedCurrencies.includes(currency)) {
            throw new Error(`currency must be one of: ${allowedCurrencies.join(', ')}`);
        }
    }
    validatePaymentMethods(paymentMethods) {
        if (paymentMethods === null) {
            return;
        }
        const allowedPaymentMethods = [
            'credit_card',
            'debit_card',
            'pix',
            'boleto',
            'payment_link',
        ];
        for (const paymentMethod of paymentMethods) {
            if (!allowedPaymentMethods.includes(paymentMethod)) {
                throw new Error(`paymentMethods contains invalid method: ${paymentMethod}`);
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
};
exports.RegisterSubscriptionPlanUseCase = RegisterSubscriptionPlanUseCase;
exports.RegisterSubscriptionPlanUseCase = RegisterSubscriptionPlanUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_subscription_plan_by_slug_and_office_id_service_1.FindSubscriptionPlanBySlugAndOfficeIdService,
        create_subscription_plan_service_1.CreateSubscriptionPlanService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterSubscriptionPlanUseCase);
//# sourceMappingURL=register-subscription-plan.use-case.js.map