"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionDtoIn = void 0;
class CreateSubscriptionDtoIn {
    officeId;
    clientId;
    subscriptionPlanId;
    paymentCustomerId;
    gatewayId;
    apiCredentialId;
    gatewaySubscriptionId;
    externalReference;
    amount;
    currency;
    currentCycle;
    nextBillingAt;
    startedAt;
    canceledAt;
    endedAt;
    metadata;
    config;
    status;
    constructor(officeId, clientId, subscriptionPlanId, paymentCustomerId, gatewayId, apiCredentialId, gatewaySubscriptionId, externalReference, amount, currency, currentCycle, nextBillingAt, startedAt, canceledAt, endedAt, metadata, config, status) {
        this.officeId = officeId;
        this.clientId = clientId;
        this.subscriptionPlanId = subscriptionPlanId;
        this.paymentCustomerId = paymentCustomerId;
        this.gatewayId = gatewayId;
        this.apiCredentialId = apiCredentialId;
        this.gatewaySubscriptionId = gatewaySubscriptionId;
        this.externalReference = externalReference;
        this.amount = amount;
        this.currency = currency;
        this.currentCycle = currentCycle;
        this.nextBillingAt = nextBillingAt;
        this.startedAt = startedAt;
        this.canceledAt = canceledAt;
        this.endedAt = endedAt;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSubscriptionDtoIn = CreateSubscriptionDtoIn;
//# sourceMappingURL=create-subscription.dto-in.js.map