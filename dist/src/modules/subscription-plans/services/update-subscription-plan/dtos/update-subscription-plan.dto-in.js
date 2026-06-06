"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanDtoIn = void 0;
class UpdateSubscriptionPlanDtoIn {
    _id;
    officeId;
    clientId;
    gatewayId;
    apiCredentialId;
    name;
    slug;
    description;
    billingInterval;
    billingIntervalCount;
    amount;
    currency;
    trialDays;
    maxBillingCycles;
    gatewayPlanId;
    paymentMethods;
    metadata;
    config;
    status;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.description = params.description ?? null;
        this.billingInterval = params.billingInterval ?? null;
        this.billingIntervalCount = params.billingIntervalCount ?? null;
        this.amount = params.amount ?? null;
        this.currency = params.currency ?? null;
        this.trialDays = params.trialDays ?? null;
        this.maxBillingCycles = params.maxBillingCycles ?? null;
        this.gatewayPlanId = params.gatewayPlanId ?? null;
        this.paymentMethods = params.paymentMethods ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source;
    }
}
exports.UpdateSubscriptionPlanDtoIn = UpdateSubscriptionPlanDtoIn;
//# sourceMappingURL=update-subscription-plan.dto-in.js.map