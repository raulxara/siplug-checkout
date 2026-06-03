"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const use_case_support_module_1 = require("../../common/services/use-case-support/use-case-support.module");
const security_module_1 = require("../../modules/security/security.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const subscriptions_module_1 = require("../../modules/subscriptions/subscriptions.module");
const register_subscription_controller_1 = require("./register-subscription.controller");
const register_subscription_use_case_1 = require("./register-subscription.use-case");
let RegisterSubscriptionModule = class RegisterSubscriptionModule {
};
exports.RegisterSubscriptionModule = RegisterSubscriptionModule;
exports.RegisterSubscriptionModule = RegisterSubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            subscription_plans_module_1.SubscriptionPlansModule,
            subscriptions_module_1.SubscriptionsModule,
            security_module_1.SecurityModule,
            use_case_support_module_1.UseCaseSupportModule,
        ],
        controllers: [register_subscription_controller_1.RegisterSubscriptionController],
        providers: [register_subscription_use_case_1.RegisterSubscriptionUseCase],
        exports: [register_subscription_use_case_1.RegisterSubscriptionUseCase],
    })
], RegisterSubscriptionModule);
//# sourceMappingURL=register-subscription.module.js.map