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
exports.GetSubscriptionPlanByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const find_subscription_plan_by_unique_id_dto_in_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/dtos/find-subscription-plan-by-unique-id.dto-in");
const find_subscription_plan_by_unique_id_service_1 = require("../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_subscription_plan_by_unique_id_dto_out_1 = require("./dtos/get-subscription-plan-by-unique-id.dto-out");
let GetSubscriptionPlanByUniqueIdUseCase = class GetSubscriptionPlanByUniqueIdUseCase {
    findSubscriptionPlanByUniqueIdService;
    resolveActorAuthorizationService;
    constructor(findSubscriptionPlanByUniqueIdService, resolveActorAuthorizationService) {
        this.findSubscriptionPlanByUniqueIdService = findSubscriptionPlanByUniqueIdService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        const subscriptionPlanDtoOut = await this.findSubscriptionPlanByUniqueIdService.exec(new find_subscription_plan_by_unique_id_dto_in_1.FindSubscriptionPlanByUniqueIdDtoIn(dtoIn.subscriptionPlanId));
        const subscriptionPlan = subscriptionPlanDtoOut.subscriptionPlan;
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_plans',
            requiredAction: 'getSubscriptionPlanByUniqueId',
        });
        return new get_subscription_plan_by_unique_id_dto_out_1.GetSubscriptionPlanByUniqueIdDtoOut(subscriptionPlan);
    }
};
exports.GetSubscriptionPlanByUniqueIdUseCase = GetSubscriptionPlanByUniqueIdUseCase;
exports.GetSubscriptionPlanByUniqueIdUseCase = GetSubscriptionPlanByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], GetSubscriptionPlanByUniqueIdUseCase);
//# sourceMappingURL=get-subscription-plan-by-unique-id.use-case.js.map