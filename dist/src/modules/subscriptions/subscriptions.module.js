"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const subscriptions_repository_1 = require("./repositories/subscriptions.repository");
const create_subscription_service_1 = require("./services/create-subscription/create-subscription.service");
const find_subscription_by_external_reference_and_office_id_service_1 = require("./services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service");
const find_subscription_by_unique_id_service_1 = require("./services/find-subscription-by-unique-id/find-subscription-by-unique-id.service");
const update_subscription_service_1 = require("./services/update-subscription/update-subscription.service");
const subscriptions_tokens_1 = require("./tokens/subscriptions.tokens");
let SubscriptionsModule = class SubscriptionsModule {
};
exports.SubscriptionsModule = SubscriptionsModule;
exports.SubscriptionsModule = SubscriptionsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY,
                useClass: subscriptions_repository_1.SubscriptionsRepository,
            },
            create_subscription_service_1.CreateSubscriptionService,
            find_subscription_by_unique_id_service_1.FindSubscriptionByUniqueIdService,
            find_subscription_by_external_reference_and_office_id_service_1.FindSubscriptionByExternalReferenceAndOfficeIdService,
            update_subscription_service_1.UpdateSubscriptionService,
        ],
        exports: [
            subscriptions_tokens_1.SUBSCRIPTIONS_REPOSITORY,
            create_subscription_service_1.CreateSubscriptionService,
            find_subscription_by_unique_id_service_1.FindSubscriptionByUniqueIdService,
            find_subscription_by_external_reference_and_office_id_service_1.FindSubscriptionByExternalReferenceAndOfficeIdService,
            update_subscription_service_1.UpdateSubscriptionService,
        ],
    })
], SubscriptionsModule);
//# sourceMappingURL=subscriptions.module.js.map