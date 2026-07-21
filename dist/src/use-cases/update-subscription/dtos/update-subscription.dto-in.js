"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionDtoIn = void 0;
class UpdateSubscriptionDtoIn {
    token;
    subscriptionId;
    gatewaySubscriptionId;
    currentCycle;
    nextBillingAt;
    startedAt;
    canceledAt;
    endedAt;
    metadata;
    config;
    status;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionId = String(params.subscriptionId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionId === '') {
            throw new Error('subscriptionId is required');
        }
        this.gatewaySubscriptionId = this.toNullableString(params.gatewaySubscriptionId);
        this.currentCycle = this.toNullableNumber(params.currentCycle);
        this.nextBillingAt = this.toNullableString(params.nextBillingAt);
        this.startedAt = this.toNullableString(params.startedAt);
        this.canceledAt = this.toNullableString(params.canceledAt);
        this.endedAt = this.toNullableString(params.endedAt);
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
exports.UpdateSubscriptionDtoIn = UpdateSubscriptionDtoIn;
//# sourceMappingURL=update-subscription.dto-in.js.map