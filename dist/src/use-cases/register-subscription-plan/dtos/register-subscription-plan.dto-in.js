"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSubscriptionPlanDtoIn = void 0;
class RegisterSubscriptionPlanDtoIn {
    token;
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
    paymentMethods;
    metadata;
    config;
    status;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.officeId || params.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (!params.clientId || params.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (!params.name || params.name.trim() === '') {
            throw new Error('name is required');
        }
        if (!params.slug || params.slug.trim() === '') {
            throw new Error('slug is required');
        }
        if (!params.billingInterval || params.billingInterval.trim() === '') {
            throw new Error('billingInterval is required');
        }
        if (!Number.isInteger(params.amount) || params.amount <= 0) {
            throw new Error('amount must be a positive integer in cents');
        }
        this.token = params.token.trim();
        this.officeId = params.officeId.trim();
        this.clientId = params.clientId.trim();
        this.gatewayId = this.normalizeNullableString(params.gatewayId);
        this.apiCredentialId = this.normalizeNullableString(params.apiCredentialId);
        this.name = params.name.trim();
        this.slug = params.slug.trim();
        this.description = this.normalizeNullableString(params.description);
        this.billingInterval = params.billingInterval.trim();
        this.billingIntervalCount = params.billingIntervalCount ?? 1;
        if (!Number.isInteger(this.billingIntervalCount) ||
            this.billingIntervalCount < 1) {
            throw new Error('billingIntervalCount must be greater than or equal to 1');
        }
        this.amount = params.amount;
        this.currency = (params.currency ?? 'BRL').trim().toUpperCase();
        this.trialDays = params.trialDays ?? null;
        this.maxBillingCycles = params.maxBillingCycles ?? null;
        this.paymentMethods = params.paymentMethods ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status?.trim() || 'active';
    }
    normalizeNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.RegisterSubscriptionPlanDtoIn = RegisterSubscriptionPlanDtoIn;
//# sourceMappingURL=register-subscription-plan.dto-in.js.map