"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanDtoIn = void 0;
class UpdateSubscriptionPlanDtoIn {
    token;
    subscriptionPlanId;
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
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionPlanId = String(params.subscriptionPlanId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionPlanId === '') {
            throw new Error('subscriptionPlanId is required');
        }
        this.officeId = this.toNullableString(params.officeId);
        this.clientId = this.toNullableString(params.clientId);
        this.gatewayId = this.toNullableString(params.gatewayId);
        this.apiCredentialId = this.toNullableString(params.apiCredentialId);
        this.name = this.toNullableString(params.name);
        this.slug = this.toNullableString(params.slug);
        this.description = this.toNullableString(params.description);
        this.billingInterval = this.toNullableString(params.billingInterval);
        this.billingIntervalCount = this.toNullableNumber(params.billingIntervalCount);
        this.amount = this.toNullableNumber(params.amount);
        this.currency = this.toNullableString(params.currency);
        this.trialDays = this.toNullableNumber(params.trialDays);
        this.maxBillingCycles = this.toNullableNumber(params.maxBillingCycles);
        this.gatewayPlanId = this.toNullableString(params.gatewayPlanId);
        this.paymentMethods = Array.isArray(params.paymentMethods)
            ? params.paymentMethods.map((item) => String(item).trim()).filter(Boolean)
            : null;
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status);
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableNumber(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isFinite(numberValue)) {
            throw new Error(`invalid number value: ${String(value)}`);
        }
        return numberValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('metadata/config must be an object');
        }
        return value;
    }
}
exports.UpdateSubscriptionPlanDtoIn = UpdateSubscriptionPlanDtoIn;
//# sourceMappingURL=update-subscription-plan.dto-in.js.map