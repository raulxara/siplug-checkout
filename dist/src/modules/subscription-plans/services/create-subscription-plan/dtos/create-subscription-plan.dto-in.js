"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionPlanDtoIn = void 0;
class CreateSubscriptionPlanDtoIn {
    officeId;
    clientId;
    gatewayId;
    apiCredentialId;
    gatewayPlanId;
    name;
    slug;
    description;
    billingInterval;
    billingIntervalCount;
    amount;
    currency;
    trialDays;
    maxBillingCycles;
    paymentMethods;
    metadata;
    config;
    status;
    constructor(officeId, clientId, gatewayId, apiCredentialId, gatewayPlanId, name, slug, description, billingInterval, billingIntervalCount, amount, currency, trialDays, maxBillingCycles, paymentMethods, metadata, config, status) {
        this.officeId = officeId;
        this.clientId = clientId;
        this.gatewayId = gatewayId;
        this.apiCredentialId = apiCredentialId;
        this.gatewayPlanId = gatewayPlanId;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.billingInterval = billingInterval;
        this.billingIntervalCount = billingIntervalCount;
        this.amount = amount;
        this.currency = currency;
        this.trialDays = trialDays;
        this.maxBillingCycles = maxBillingCycles;
        this.paymentMethods = paymentMethods;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSubscriptionPlanDtoIn = CreateSubscriptionPlanDtoIn;
//# sourceMappingURL=create-subscription-plan.dto-in.js.map