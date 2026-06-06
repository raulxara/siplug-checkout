"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionPlanByUniqueIdModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const get_subscription_plan_by_unique_id_controller_1 = require("./get-subscription-plan-by-unique-id.controller");
const get_subscription_plan_by_unique_id_use_case_1 = require("./get-subscription-plan-by-unique-id.use-case");
let GetSubscriptionPlanByUniqueIdModule = class GetSubscriptionPlanByUniqueIdModule {
};
exports.GetSubscriptionPlanByUniqueIdModule = GetSubscriptionPlanByUniqueIdModule;
exports.GetSubscriptionPlanByUniqueIdModule = GetSubscriptionPlanByUniqueIdModule = __decorate([
    (0, common_1.Module)({
        imports: [subscription_plans_module_1.SubscriptionPlansModule, security_module_1.SecurityModule],
        controllers: [get_subscription_plan_by_unique_id_controller_1.GetSubscriptionPlanByUniqueIdController],
        providers: [get_subscription_plan_by_unique_id_use_case_1.GetSubscriptionPlanByUniqueIdUseCase],
        exports: [get_subscription_plan_by_unique_id_use_case_1.GetSubscriptionPlanByUniqueIdUseCase],
    })
], GetSubscriptionPlanByUniqueIdModule);
//# sourceMappingURL=get-subscription-plan-by-unique-id.module.js.map