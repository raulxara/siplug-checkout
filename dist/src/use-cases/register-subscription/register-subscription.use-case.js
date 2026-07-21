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
exports.RegisterSubscriptionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const find_subscription_plan_by_unique_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in");
const find_subscription_plan_by_unique_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const create_subscription_dto_in_1 = require("../../modules/subscriptions/services/create-subscription/dtos/create-subscription.dto-in");
const create_subscription_service_1 = require("../../modules/subscriptions/services/create-subscription/create-subscription.service");
const find_subscription_by_external_reference_and_office_id_dto_in_1 = require("../../modules/subscriptions/services/find-subscription-by-external-reference-and-office-id/dtos/find-subscription-by-external-reference-and-office-id.dto-in");
const find_subscription_by_external_reference_and_office_id_service_1 = require("../../modules/subscriptions/services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service");
const register_subscription_dto_out_1 = require("./dtos/register-subscription.dto-out");
let RegisterSubscriptionUseCase = class RegisterSubscriptionUseCase {
    resolveActorAuthorizationService;
    findSubscriptionPlanByUniqueIdService;
    findSubscriptionByExternalReferenceAndOfficeIdService;
    createSubscriptionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findSubscriptionPlanByUniqueIdService, findSubscriptionByExternalReferenceAndOfficeIdService, createSubscriptionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findSubscriptionPlanByUniqueIdService = findSubscriptionPlanByUniqueIdService;
        this.findSubscriptionByExternalReferenceAndOfficeIdService = findSubscriptionByExternalReferenceAndOfficeIdService;
        this.createSubscriptionService = createSubscriptionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerSubscription',
                requiredEntity: 'subscriptions',
            }));
            this.validateStatus(dtoIn.status);
            this.assertNoSensitiveFields(dtoIn.metadata, 'metadata');
            this.assertNoSensitiveFields(dtoIn.config, 'config');
            const subscriptionPlanDtoOut = await this.findSubscriptionPlanByUniqueIdService.exec(new find_subscription_plan_by_unique_id_dto_in_1.FindSubscriptionPlanByUniqueIdDtoIn(dtoIn.subscriptionPlanId));
            const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;
            if (subscriptionPlan.status !== 'active') {
                throw new Error('subscription plan is not active');
            }
            if (subscriptionPlan.officeId !== dtoIn.officeId) {
                throw new Error('subscription plan does not belong to office');
            }
            if (subscriptionPlan.clientId !== dtoIn.clientId) {
                throw new Error('subscription plan does not belong to client');
            }
            if (dtoIn.externalReference !== null) {
                const existingSubscriptionDtoOut = await this.findSubscriptionByExternalReferenceAndOfficeIdService.exec(new find_subscription_by_external_reference_and_office_id_dto_in_1.FindSubscriptionByExternalReferenceAndOfficeIdDtoIn({
                    externalReference: dtoIn.externalReference,
                    officeId: dtoIn.officeId,
                }));
                if (existingSubscriptionDtoOut.subscription !== null) {
                    throw new Error('subscription externalReference already exists for this office');
                }
            }
            const amount = dtoIn.amount ?? subscriptionPlan.amount;
            const currency = dtoIn.currency ?? subscriptionPlan.currency;
            const nextBillingAt = dtoIn.nextBillingAt ??
                this.resolveInitialNextBillingAt(subscriptionPlan.trialDays);
            const createDtoOut = await this.createSubscriptionService.exec(new create_subscription_dto_in_1.CreateSubscriptionDtoIn(dtoIn.officeId, dtoIn.clientId, dtoIn.subscriptionPlanId, dtoIn.paymentCustomerId, dtoIn.gatewayId ?? subscriptionPlan.gatewayId, dtoIn.apiCredentialId ?? subscriptionPlan.apiCredentialId, null, dtoIn.externalReference, amount, currency, 0, nextBillingAt, null, null, null, {
                ...(dtoIn.metadata ?? {}),
                source: 'RegisterSubscriptionUseCase',
            }, {
                ...(dtoIn.config ?? {}),
                subscriptionPlanSnapshot: {
                    id: subscriptionPlan._id,
                    name: subscriptionPlan.name,
                    slug: subscriptionPlan.slug,
                    billingInterval: subscriptionPlan.billingInterval,
                    billingIntervalCount: subscriptionPlan.billingIntervalCount,
                    amount: subscriptionPlan.amount,
                    currency: subscriptionPlan.currency,
                    trialDays: subscriptionPlan.trialDays,
                    maxBillingCycles: subscriptionPlan.maxBillingCycles,
                    paymentMethods: subscriptionPlan.paymentMethods,
                },
            }, dtoIn.status));
            return new register_subscription_dto_out_1.RegisterSubscriptionDtoOut(createDtoOut.subscription);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterSubscriptionUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    subscriptionPlanId: dtoIn.subscriptionPlanId,
                    paymentCustomerId: dtoIn.paymentCustomerId,
                    gatewayId: dtoIn.gatewayId,
                    apiCredentialId: dtoIn.apiCredentialId,
                    externalReference: dtoIn.externalReference,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register subscription use case';
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
    validateStatus(status) {
        const allowedStatuses = ['created', 'pending', 'active', 'inactive'];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`status must be one of: ${allowedStatuses.join(', ')}`);
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
exports.RegisterSubscriptionUseCase = RegisterSubscriptionUseCase;
exports.RegisterSubscriptionUseCase = RegisterSubscriptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
        find_subscription_by_external_reference_and_office_id_service_1.FindSubscriptionByExternalReferenceAndOfficeIdService,
        create_subscription_service_1.CreateSubscriptionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterSubscriptionUseCase);
//# sourceMappingURL=register-subscription.use-case.js.map