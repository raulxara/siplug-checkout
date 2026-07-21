"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSubscriptionDtoIn = void 0;
class RegisterSubscriptionDtoIn {
    token;
    officeId;
    clientId;
    subscriptionPlanId;
    paymentCustomerId;
    gatewayId;
    apiCredentialId;
    externalReference;
    amount;
    currency;
    nextBillingAt;
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
        if (!params.subscriptionPlanId || params.subscriptionPlanId.trim() === '') {
            throw new Error('subscriptionPlanId is required');
        }
        if (!params.paymentCustomerId || params.paymentCustomerId.trim() === '') {
            throw new Error('paymentCustomerId is required');
        }
        if (params.amount !== undefined &&
            params.amount !== null &&
            (!Number.isInteger(params.amount) || params.amount <= 0)) {
            throw new Error('amount must be a positive integer in cents');
        }
        this.token = params.token.trim();
        this.officeId = params.officeId.trim();
        this.clientId = params.clientId.trim();
        this.subscriptionPlanId = params.subscriptionPlanId.trim();
        this.paymentCustomerId = params.paymentCustomerId.trim();
        this.gatewayId = this.normalizeNullableString(params.gatewayId);
        this.apiCredentialId = this.normalizeNullableString(params.apiCredentialId);
        this.externalReference = this.normalizeNullableString(params.externalReference);
        this.amount = params.amount ?? null;
        this.currency = this.normalizeNullableString(params.currency);
        this.nextBillingAt = this.normalizeNullableString(params.nextBillingAt);
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status?.trim() || 'created';
    }
    normalizeNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.RegisterSubscriptionDtoIn = RegisterSubscriptionDtoIn;
//# sourceMappingURL=register-subscription.dto-in.js.map