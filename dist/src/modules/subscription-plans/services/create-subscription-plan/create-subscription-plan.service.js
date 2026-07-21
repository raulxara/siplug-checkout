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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionPlanService = void 0;
const common_1 = require("@nestjs/common");
const subscription_plan_entity_1 = require("../../entities/subscription-plan.entity");
const subscription_plans_tokens_1 = require("../../tokens/subscription-plans.tokens");
const create_subscription_plan_dto_out_1 = require("./dtos/create-subscription-plan.dto-out");
let CreateSubscriptionPlanService = class CreateSubscriptionPlanService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new subscription_plan_entity_1.SubscriptionPlanEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.clientId = dtoIn.clientId;
            entity.gatewayId = dtoIn.gatewayId;
            entity.apiCredentialId = dtoIn.apiCredentialId;
            entity.gatewayPlanId = dtoIn.gatewayPlanId;
            entity.name = dtoIn.name;
            entity.slug = dtoIn.slug;
            entity.description = dtoIn.description;
            entity.billingInterval = dtoIn.billingInterval;
            entity.billingIntervalCount = dtoIn.billingIntervalCount;
            entity.amount = dtoIn.amount;
            entity.currency = dtoIn.currency;
            entity.trialDays = dtoIn.trialDays;
            entity.maxBillingCycles = dtoIn.maxBillingCycles;
            entity.paymentMethods = dtoIn.paymentMethods;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            const created = await entity.create();
            return new create_subscription_plan_dto_out_1.CreateSubscriptionPlanDtoOut(this.toRow(created));
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create subscription plan';
            throw new Error(message);
        }
    }
    toRow(entity) {
        return {
            id: this.requiredNumber(entity.id, 'subscription plan id'),
            _id: this.requiredString(entity._id, 'subscription plan _id'),
            officeId: entity.officeId,
            clientId: entity.clientId,
            gatewayId: entity.gatewayId,
            apiCredentialId: entity.apiCredentialId,
            gatewayPlanId: entity.gatewayPlanId,
            name: entity.name,
            slug: entity.slug,
            description: entity.description,
            billingInterval: entity.billingInterval,
            billingIntervalCount: entity.billingIntervalCount,
            amount: entity.amount,
            currency: entity.currency,
            trialDays: entity.trialDays,
            maxBillingCycles: entity.maxBillingCycles,
            paymentMethods: entity.paymentMethods,
            metadata: entity.metadata,
            config: entity.config,
            changesHistory: entity.changesHistory,
            status: this.requiredString(entity.status, 'subscription plan status'),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    requiredNumber(value, field) {
        if (value === null) {
            throw new Error(`${field} was not hydrated`);
        }
        return value;
    }
    requiredString(value, field) {
        if (value === null || value.trim() === '') {
            throw new Error(`${field} was not hydrated`);
        }
        return value;
    }
};
exports.CreateSubscriptionPlanService = CreateSubscriptionPlanService;
exports.CreateSubscriptionPlanService = CreateSubscriptionPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_plans_tokens_1.SUBSCRIPTION_PLANS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSubscriptionPlanService);
//# sourceMappingURL=create-subscription-plan.service.js.map