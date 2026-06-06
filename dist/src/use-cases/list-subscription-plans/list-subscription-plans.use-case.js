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
exports.ListSubscriptionPlansUseCase = void 0;
const common_1 = require("@nestjs/common");
const get_all_subscription_plans_service_1 = require("../../modules/subscription-plans/services/get-all-subscription-plans/get-all-subscription-plans.service");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_subscription_plans_dto_out_1 = require("./dtos/list-subscription-plans.dto-out");
let ListSubscriptionPlansUseCase = class ListSubscriptionPlansUseCase {
    getAllSubscriptionPlansService;
    resolveActorAuthorizationService;
    constructor(getAllSubscriptionPlansService, resolveActorAuthorizationService) {
        this.getAllSubscriptionPlansService = getAllSubscriptionPlansService;
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
    }
    async exec(dtoIn) {
        await this.resolveActorAuthorizationService.exec({
            token: dtoIn.token,
            requiredEntity: 'subscription_plans',
            requiredAction: 'listSubscriptionPlans',
        });
        const subscriptionPlansDtoOut = await this.getAllSubscriptionPlansService.exec();
        return new list_subscription_plans_dto_out_1.ListSubscriptionPlansDtoOut(subscriptionPlansDtoOut.subscriptionPlans);
    }
};
exports.ListSubscriptionPlansUseCase = ListSubscriptionPlansUseCase;
exports.ListSubscriptionPlansUseCase = ListSubscriptionPlansUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [get_all_subscription_plans_service_1.GetAllSubscriptionPlansService,
        resolve_actor_authorization_service_1.ResolveActorAuthorizationService])
], ListSubscriptionPlansUseCase);
//# sourceMappingURL=list-subscription-plans.use-case.js.map