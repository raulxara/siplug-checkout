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
exports.RegisterSubscriptionPlanController = void 0;
const common_1 = require("@nestjs/common");
const register_subscription_plan_dto_in_1 = require("./dtos/register-subscription-plan.dto-in");
const register_subscription_plan_request_1 = require("./http/register-subscription-plan.request");
const register_subscription_plan_use_case_1 = require("./register-subscription-plan.use-case");
let RegisterSubscriptionPlanController = class RegisterSubscriptionPlanController {
    registerSubscriptionPlanUseCase;
    constructor(registerSubscriptionPlanUseCase) {
        this.registerSubscriptionPlanUseCase = registerSubscriptionPlanUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.registerSubscriptionPlanUseCase.exec(new register_subscription_plan_dto_in_1.RegisterSubscriptionPlanDtoIn({
                token: this.extractBearerToken(authorization),
                officeId: body.officeId,
                clientId: body.clientId,
                gatewayId: body.gatewayId ?? null,
                apiCredentialId: body.apiCredentialId ?? null,
                name: body.name,
                slug: body.slug,
                description: body.description ?? null,
                billingInterval: body.billingInterval,
                billingIntervalCount: body.billingIntervalCount ?? 1,
                amount: body.amount,
                currency: body.currency ?? 'BRL',
                trialDays: body.trialDays ?? null,
                maxBillingCycles: body.maxBillingCycles ?? null,
                paymentMethods: body.paymentMethods ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'subscription plan registered successfully',
                data: {
                    subscriptionPlan: dtoOut.subscriptionPlan,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register subscription plan';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
    extractBearerToken(authorization) {
        if (!authorization || authorization.trim() === '') {
            throw new Error('authorization header is required');
        }
        return authorization.replace(/^Bearer\s+/i, '').trim();
    }
};
exports.RegisterSubscriptionPlanController = RegisterSubscriptionPlanController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_subscription_plan_request_1.RegisterSubscriptionPlanRequest]),
    __metadata("design:returntype", Promise)
], RegisterSubscriptionPlanController.prototype, "handle", null);
exports.RegisterSubscriptionPlanController = RegisterSubscriptionPlanController = __decorate([
    (0, common_1.Controller)('subscription-plans'),
    __metadata("design:paramtypes", [register_subscription_plan_use_case_1.RegisterSubscriptionPlanUseCase])
], RegisterSubscriptionPlanController);
//# sourceMappingURL=register-subscription-plan.controller.js.map