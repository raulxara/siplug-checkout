"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSubscriptionPlanModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const clients_module_1 = require("../../modules/clients/clients.module");
const offices_module_1 = require("../../modules/offices/offices.module");
const security_module_1 = require("../../modules/security/security.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const register_subscription_plan_controller_1 = require("./register-subscription-plan.controller");
const register_subscription_plan_use_case_1 = require("./register-subscription-plan.use-case");
let RegisterSubscriptionPlanModule = class RegisterSubscriptionPlanModule {
};
exports.RegisterSubscriptionPlanModule = RegisterSubscriptionPlanModule;
exports.RegisterSubscriptionPlanModule = RegisterSubscriptionPlanModule = __decorate([
    (0, common_1.Module)({
        imports: [
            offices_module_1.OfficesModule,
            clients_module_1.ClientsModule,
            subscription_plans_module_1.SubscriptionPlansModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [register_subscription_plan_controller_1.RegisterSubscriptionPlanController],
        providers: [register_subscription_plan_use_case_1.RegisterSubscriptionPlanUseCase],
        exports: [register_subscription_plan_use_case_1.RegisterSubscriptionPlanUseCase],
    })
], RegisterSubscriptionPlanModule);
//# sourceMappingURL=register-subscription-plan.module.js.map