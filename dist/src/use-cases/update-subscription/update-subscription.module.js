"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionModule = void 0;
const common_1 = require("@nestjs/common");
const security_module_1 = require("../../modules/security/security.module");
const subscriptions_module_1 = require("../../modules/subscriptions/subscriptions.module");
const update_subscription_controller_1 = require("./update-subscription.controller");
const update_subscription_use_case_1 = require("./update-subscription.use-case");
let UpdateSubscriptionModule = class UpdateSubscriptionModule {
};
exports.UpdateSubscriptionModule = UpdateSubscriptionModule;
exports.UpdateSubscriptionModule = UpdateSubscriptionModule = __decorate([
    (0, common_1.Module)({
        imports: [subscriptions_module_1.SubscriptionsModule, security_module_1.SecurityModule],
        controllers: [update_subscription_controller_1.UpdateSubscriptionController],
        providers: [update_subscription_use_case_1.UpdateSubscriptionUseCase],
        exports: [update_subscription_use_case_1.UpdateSubscriptionUseCase],
    })
], UpdateSubscriptionModule);
//# sourceMappingURL=update-subscription.module.js.map