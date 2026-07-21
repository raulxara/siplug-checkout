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
exports.CreateSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const subscription_entity_1 = require("../../entities/subscription.entity");
const subscriptions_tokens_1 = require("../../tokens/subscriptions.tokens");
const create_subscription_dto_out_1 = require("./dtos/create-subscription.dto-out");
let CreateSubscriptionService = class CreateSubscriptionService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new subscription_entity_1.SubscriptionEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.clientId = dtoIn.clientId;
            entity.subscriptionPlanId = dtoIn.subscriptionPlanId;
            entity.paymentCustomerId = dtoIn.paymentCustomerId;
            entity.gatewayId = dtoIn.gatewayId;
            entity.apiCredentialId = dtoIn.apiCredentialId;
            entity.gatewaySubscriptionId = dtoIn.gatewaySubscriptionId;
            entity.externalReference = dtoIn.externalReference;
            entity.amount = dtoIn.amount;
            entity.currency = dtoIn.currency;
            entity.currentCycle = dtoIn.currentCycle;
            entity.nextBillingAt = dtoIn.nextBillingAt;
            entity.startedAt = dtoIn.startedAt;
            entity.canceledAt = dtoIn.canceledAt;
            entity.endedAt = dtoIn.endedAt;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            const created = await entity.create();
            return new create_subscription_dto_out_1.CreateSubscriptionDtoOut(this.toRow(created));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on create subscription';
            throw new Error(message);
        }
    }
    toRow(entity) {
        return {
            id: this.requiredNumber(entity.id, 'subscription id'),
            _id: this.requiredString(entity._id, 'subscription _id'),
            officeId: entity.officeId,
            clientId: entity.clientId,
            subscriptionPlanId: entity.subscriptionPlanId,
            paymentCustomerId: entity.paymentCustomerId,
            gatewayId: entity.gatewayId,
            apiCredentialId: entity.apiCredentialId,
            gatewaySubscriptionId: entity.gatewaySubscriptionId,
            externalReference: entity.externalReference,
            amount: entity.amount,
            currency: entity.currency,
            currentCycle: entity.currentCycle,
            nextBillingAt: entity.nextBillingAt,
            startedAt: entity.startedAt,
            canceledAt: entity.canceledAt,
            endedAt: entity.endedAt,
            metadata: entity.metadata,
            config: entity.config,
            changesHistory: entity.changesHistory,
            status: this.requiredString(entity.status, 'subscription status'),
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
exports.CreateSubscriptionService = CreateSubscriptionService;
exports.CreateSubscriptionService = CreateSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSubscriptionService);
//# sourceMappingURL=create-subscription.service.js.map