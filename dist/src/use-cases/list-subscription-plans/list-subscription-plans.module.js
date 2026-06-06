"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionPlansModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const subscription_plans_module_1 = require("../../modules/subscription-plans/subscription-plans.module");
const list_subscription_plans_controller_1 = require("./list-subscription-plans.controller");
const list_subscription_plans_use_case_1 = require("./list-subscription-plans.use-case");
let ListSubscriptionPlansModule = class ListSubscriptionPlansModule {
};
exports.ListSubscriptionPlansModule = ListSubscriptionPlansModule;
exports.ListSubscriptionPlansModule = ListSubscriptionPlansModule = __decorate([
    (0, common_1.Module)({
        imports: [subscription_plans_module_1.SubscriptionPlansModule, security_module_1.SecurityModule],
        controllers: [list_subscription_plans_controller_1.ListSubscriptionPlansController],
        providers: [list_subscription_plans_use_case_1.ListSubscriptionPlansUseCase],
        exports: [list_subscription_plans_use_case_1.ListSubscriptionPlansUseCase],
    })
], ListSubscriptionPlansModule);
//# sourceMappingURL=list-subscription-plans.module.js.map