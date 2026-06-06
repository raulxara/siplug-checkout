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
exports.UpdateSubscriptionPlanController = void 0;
const common_1 = require("@nestjs/common");
const update_subscription_plan_dto_in_1 = require("./dtos/update-subscription-plan.dto-in");
const update_subscription_plan_request_1 = require("./http/update-subscription-plan.request");
const update_subscription_plan_use_case_1 = require("./update-subscription-plan.use-case");
let UpdateSubscriptionPlanController = class UpdateSubscriptionPlanController {
    updateSubscriptionPlanUseCase;
    constructor(updateSubscriptionPlanUseCase) {
        this.updateSubscriptionPlanUseCase = updateSubscriptionPlanUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.updateSubscriptionPlanUseCase.exec(new update_subscription_plan_dto_in_1.UpdateSubscriptionPlanDtoIn({
            token: this.resolveToken(authorization, request.token),
            subscriptionPlanId: request.subscriptionPlanId ?? request._id,
            officeId: request.officeId,
            clientId: request.clientId,
            gatewayId: request.gatewayId,
            apiCredentialId: request.apiCredentialId,
            name: request.name,
            slug: request.slug,
            description: request.description,
            billingInterval: request.billingInterval,
            billingIntervalCount: request.billingIntervalCount,
            amount: request.amount,
            currency: request.currency,
            trialDays: request.trialDays,
            maxBillingCycles: request.maxBillingCycles,
            gatewayPlanId: request.gatewayPlanId,
            paymentMethods: request.paymentMethods,
            metadata: request.metadata,
            config: request.config,
            status: request.status,
        }));
        return {
            status: 'success',
            message: 'subscription plan updated successfully',
            data: {
                subscriptionPlan: dtoOut.subscriptionPlan,
            },
        };
    }
    resolveToken(authorization, fallbackToken) {
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '').trim();
        }
        return String(fallbackToken ?? '').trim();
    }
};
exports.UpdateSubscriptionPlanController = UpdateSubscriptionPlanController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_subscription_plan_request_1.UpdateSubscriptionPlanRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateSubscriptionPlanController.prototype, "handle", null);
exports.UpdateSubscriptionPlanController = UpdateSubscriptionPlanController = __decorate([
    (0, common_1.Controller)('subscription-plans'),
    __metadata("design:paramtypes", [update_subscription_plan_use_case_1.UpdateSubscriptionPlanUseCase])
], UpdateSubscriptionPlanController);
//# sourceMappingURL=update-subscription-plan.controller.js.map