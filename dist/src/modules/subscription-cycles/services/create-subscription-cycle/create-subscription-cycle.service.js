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
exports.CreateSubscriptionCycleService = void 0;
const common_1 = require("@nestjs/common");
const subscription_cycle_entity_1 = require("../../entities/subscription-cycle.entity");
const subscription_cycles_tokens_1 = require("../../tokens/subscription-cycles.tokens");
const create_subscription_cycle_dto_out_1 = require("./dtos/create-subscription-cycle.dto-out");
let CreateSubscriptionCycleService = class CreateSubscriptionCycleService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new subscription_cycle_entity_1.SubscriptionCycleEntity(this.repository);
            entity.subscriptionId = dtoIn.subscriptionId;
            entity.cycleNumber = dtoIn.cycleNumber;
            entity.amount = dtoIn.amount;
            entity.currency = dtoIn.currency;
            entity.periodStart = dtoIn.periodStart;
            entity.periodEnd = dtoIn.periodEnd;
            entity.scheduledAt = dtoIn.scheduledAt;
            entity.processedAt = dtoIn.processedAt;
            entity.metadata = dtoIn.metadata;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            const created = await entity.create();
            return new create_subscription_cycle_dto_out_1.CreateSubscriptionCycleDtoOut(this.toRow(created));
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on create subscription cycle';
            throw new Error(message);
        }
    }
    toRow(entity) {
        return {
            id: this.requiredNumber(entity.id, 'subscription cycle id'),
            _id: this.requiredString(entity._id, 'subscription cycle _id'),
            subscriptionId: entity.subscriptionId,
            cycleNumber: entity.cycleNumber,
            amount: entity.amount,
            currency: entity.currency,
            periodStart: entity.periodStart,
            periodEnd: entity.periodEnd,
            scheduledAt: entity.scheduledAt,
            processedAt: entity.processedAt,
            metadata: entity.metadata,
            config: entity.config,
            changesHistory: entity.changesHistory,
            status: this.requiredString(entity.status, 'subscription cycle status'),
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
exports.CreateSubscriptionCycleService = CreateSubscriptionCycleService;
exports.CreateSubscriptionCycleService = CreateSubscriptionCycleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_cycles_tokens_1.SUBSCRIPTION_CYCLES_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateSubscriptionCycleService);
//# sourceMappingURL=create-subscription-cycle.service.js.map