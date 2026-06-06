"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlansModule = void 0;
const common_1 = require("@nestjs/common");
const subscription_plans_repository_1 = require("./repositories/subscription-plans.repository");
const create_subscription_plan_service_1 = require("./services/create-subscription-plan/create-subscription-plan.service");
const find_subscription_plan_by_slug_and_office_id_service_1 = require("./services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service");
const find_subscription_plan_by_unique_id_service_1 = require("./services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service");
const subscription_plans_tokens_1 = require("./tokens/subscription-plans.tokens");
const get_all_subscription_plans_service_1 = require("./services/get-all-subscription-plans/get-all-subscription-plans.service");
const get_all_subscription_plans_by_office_id_service_1 = require("./services/get-all-subscription-plans-by-office-id/get-all-subscription-plans-by-office-id.service");
const update_subscription_plan_service_1 = require("./services/update-subscription-plan/update-subscription-plan.service");
const build_changes_history_service_1 = require("../../common/services/changes-history/build-changes-history.service");
let SubscriptionPlansModule = class SubscriptionPlansModule {
};
exports.SubscriptionPlansModule = SubscriptionPlansModule;
exports.SubscriptionPlansModule = SubscriptionPlansModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: subscription_plans_tokens_1.SUBSCRIPTION_PLANS_REPOSITORY,
                useClass: subscription_plans_repository_1.SubscriptionPlansRepository,
            },
            create_subscription_plan_service_1.CreateSubscriptionPlanService,
            find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
            find_subscription_plan_by_slug_and_office_id_service_1.FindSubscriptionPlanBySlugAndOfficeIdService,
            get_all_subscription_plans_service_1.GetAllSubscriptionPlansService,
            get_all_subscription_plans_by_office_id_service_1.GetAllSubscriptionPlansByOfficeIdService,
            update_subscription_plan_service_1.UpdateSubscriptionPlanService,
            build_changes_history_service_1.BuildChangesHistoryService,
        ],
        exports: [
            subscription_plans_tokens_1.SUBSCRIPTION_PLANS_REPOSITORY,
            create_subscription_plan_service_1.CreateSubscriptionPlanService,
            find_subscription_plan_by_unique_id_service_1.FindSubscriptionPlanByUniqueIdService,
            find_subscription_plan_by_slug_and_office_id_service_1.FindSubscriptionPlanBySlugAndOfficeIdService,
            get_all_subscription_plans_service_1.GetAllSubscriptionPlansService,
            get_all_subscription_plans_by_office_id_service_1.GetAllSubscriptionPlansByOfficeIdService,
            update_subscription_plan_service_1.UpdateSubscriptionPlanService,
        ],
    })
], SubscriptionPlansModule);
//# sourceMappingURL=subscription-plans.module.js.map