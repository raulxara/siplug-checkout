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
exports.UpdateSubscriptionPlanUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_subscription_plan_by_unique_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in");
const find_subscription_plan_by_unique_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const update_subscription_plan_dto_in_1 = require("../../modules/subscription-plans/services/update-subscription-plan/dtos/update-subscription-plan.dto-in");
const update_subscription_plan_service_1 = require("../../modules/subscription-plans/services/update-subscription-plan/update-subscription-plan.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_subscription_plan_dto_out_1 = require("./dtos/update-subscription-plan.dto-out");
let UpdateSubscriptionPlanUseCase = class UpdateSubscriptionPlanUseCase {
    findSubscriptionPlanByUniqueIdService;
    updateSubscriptionPlanService;
    resolveActorAuthorizationService;
    constructor(findSubscriptionPlanByUniqueIdService, updateSubscriptionPlanService, resolveActorAuthorizationService) {
        this.findSubscriptionPlanByUniqueIdService = findSubscriptionPlanByUniqueIdService;
        this.updateSubscriptionPlanService = updateSubscriptionPlanService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        const currentSubscriptionPlanDtoOut = await this.findSubscriptionPlanByUniqueIdService.exec(new find_subscription_plan_by_unique_id_dto_in_1.FindSubscriptionPlanByUniqueIdDtoIn(dtoIn.subscriptionPlanId));
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_plans',
            requiredAction: 'updateSubscriptionPlan',
        });
        const updatedSubscriptionPlanDtoOut = await this.updateSubscriptionPlanService.exec(new update_subscription_plan_dto_in_1.UpdateSubscriptionPlanDtoIn({
            _id: dtoIn.subscriptionPlanId,
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            gatewayId: dtoIn.gatewayId,
            apiCredentialId: dtoIn.apiCredentialId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            description: dtoIn.description,
            billingInterval: dtoIn.billingInterval,
            billingIntervalCount: dtoIn.billingIntervalCount,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            trialDays: dtoIn.trialDays,
            maxBillingCycles: dtoIn.maxBillingCycles,
            gatewayPlanId: dtoIn.gatewayPlanId,
            paymentMethods: dtoIn.paymentMethods,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            status: dtoIn.status,
            source: 'UpdateSubscriptionPlanUseCase',
        }));
        return new update_subscription_plan_dto_out_1.UpdateSubscriptionPlanDtoOut(updatedSubscriptionPlanDtoOut.subscriptionPlan);
    }
};
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase;
exports.UpdateSubscriptionPlanUseCase = UpdateSubscriptionPlanUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
        update_subscription_plan_service_1.UpdateSubscriptionPlanService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], UpdateSubscriptionPlanUseCase);
//# sourceMappingURL=update-subscription-plan.use-case.js.map