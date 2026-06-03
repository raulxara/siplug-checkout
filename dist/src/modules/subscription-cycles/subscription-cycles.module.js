"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCyclesModule = void 0;
const common_1 = require("@nestjs/common");
const subscription_cycles_repository_1 = require("./repositories/subscription-cycles.repository");
const create_subscription_cycle_service_1 = require("./services/create-subscription-cycle/create-subscription-cycle.service");
const subscription_cycles_tokens_1 = require("./tokens/subscription-cycles.tokens");
let SubscriptionCyclesModule = class SubscriptionCyclesModule {
};
exports.SubscriptionCyclesModule = SubscriptionCyclesModule;
exports.SubscriptionCyclesModule = SubscriptionCyclesModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: subscription_cycles_tokens_1.SUBSCRIPTION_CYCLES_REPOSITORY,
                useClass: subscription_cycles_repository_1.SubscriptionCyclesRepository,
            },
            create_subscription_cycle_service_1.CreateSubscriptionCycleService,
        ],
        exports: [
            subscription_cycles_tokens_1.SUBSCRIPTION_CYCLES_REPOSITORY,
            create_subscription_cycle_service_1.CreateSubscriptionCycleService,
        ],
    })
], SubscriptionCyclesModule);
//# sourceMappingURL=subscription-cycles.module.js.map