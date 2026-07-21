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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanService = void 0;
const common_1 = require("@nestjs/common");
const build_changes_history_service_1 = require("../../../../common/services/changes-history/build-changes-history.service");
const subscription_plans_tokens_1 = require("../../tokens/subscription-plans.tokens");
const update_subscription_plan_dto_out_1 = require("./dtos/update-subscription-plan.dto-out");
let UpdateSubscriptionPlanService = class UpdateSubscriptionPlanService {
    subscriptionPlansRepository;
    buildChangesHistoryService;
    constructor(subscriptionPlansRepository, buildChangesHistoryService) {
        this.subscriptionPlansRepository = subscriptionPlansRepository;
        this.buildChangesHistoryService = buildChangesHistoryService;
    }
    async exec(dtoIn) {
        const current = await this.subscriptionPlansRepository.findByUniqueId(dtoIn._id);
        if (current === null) {
            throw new Error('subscription plan not found');
        }
        const newDataForHistory = this.buildNewDataForHistory(dtoIn);
        const changesHistory = this.buildChangesHistoryService.exec({
            currentChangesHistory: current.changesHistory ?? null,
            oldData: current,
            newData: newDataForHistory,
            source: dtoIn.source,
        });
        const updated = await this.subscriptionPlansRepository.updateByUniqueId(dtoIn._id, {
            office_id: dtoIn.officeId,
            client_id: dtoIn.clientId,
            gateway_id: dtoIn.gatewayId,
            api_credential_id: dtoIn.apiCredentialId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            description: dtoIn.description,
            billing_interval: dtoIn.billingInterval,
            billing_interval_count: dtoIn.billingIntervalCount,
            amount: dtoIn.amount,
            currency: dtoIn.currency,
            trial_days: dtoIn.trialDays,
            max_billing_cycles: dtoIn.maxBillingCycles,
            gateway_plan_id: dtoIn.gatewayPlanId,
            payment_methods: dtoIn.paymentMethods,
            metadata: dtoIn.metadata,
            config: dtoIn.config,
            status: dtoIn.status,
            changes_history: changesHistory,
        });
        return new update_subscription_plan_dto_out_1.UpdateSubscriptionPlanDtoOut(updated);
    }
    buildNewDataForHistory(dtoIn) {
        const newData = {};
        this.addIfNotNull(newData, 'officeId', dtoIn.officeId);
        this.addIfNotNull(newData, 'clientId', dtoIn.clientId);
        this.addIfNotNull(newData, 'gatewayId', dtoIn.gatewayId);
        this.addIfNotNull(newData, 'apiCredentialId', dtoIn.apiCredentialId);
        this.addIfNotNull(newData, 'name', dtoIn.name);
        this.addIfNotNull(newData, 'slug', dtoIn.slug);
        this.addIfNotNull(newData, 'description', dtoIn.description);
        this.addIfNotNull(newData, 'billingInterval', dtoIn.billingInterval);
        this.addIfNotNull(newData, 'billingIntervalCount', dtoIn.billingIntervalCount);
        this.addIfNotNull(newData, 'amount', dtoIn.amount);
        this.addIfNotNull(newData, 'currency', dtoIn.currency);
        this.addIfNotNull(newData, 'trialDays', dtoIn.trialDays);
        this.addIfNotNull(newData, 'maxBillingCycles', dtoIn.maxBillingCycles);
        this.addIfNotNull(newData, 'gatewayPlanId', dtoIn.gatewayPlanId);
        this.addIfNotNull(newData, 'paymentMethods', dtoIn.paymentMethods);
        this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
        this.addIfNotNull(newData, 'config', dtoIn.config);
        this.addIfNotNull(newData, 'status', dtoIn.status);
        return newData;
    }
    addIfNotNull(target, key, value) {
        if (value !== null && value !== undefined) {
            target[key] = value;
        }
    }
};
exports.UpdateSubscriptionPlanService = UpdateSubscriptionPlanService;
exports.UpdateSubscriptionPlanService = UpdateSubscriptionPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(subscription_plans_tokens_1.SUBSCRIPTION_PLANS_REPOSITORY)),
    __metadata("design:paramtypes", [Object, build_changes_history_service_1.BuildChangesHistoryService])
], UpdateSubscriptionPlanService);
//# sourceMappingURL=update-subscription-plan.service.js.map