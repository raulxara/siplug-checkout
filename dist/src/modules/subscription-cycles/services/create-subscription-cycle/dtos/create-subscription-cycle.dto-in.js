"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSubscriptionCycleDtoIn = void 0;
class CreateSubscriptionCycleDtoIn {
    subscriptionId;
    cycleNumber;
    amount;
    currency;
    periodStart;
    periodEnd;
    scheduledAt;
    processedAt;
    metadata;
    config;
    status;
    constructor(subscriptionId, cycleNumber, amount, currency, periodStart, periodEnd, scheduledAt, processedAt, metadata, config, status) {
        this.subscriptionId = subscriptionId;
        this.cycleNumber = cycleNumber;
        this.amount = amount;
        this.currency = currency;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.scheduledAt = scheduledAt;
        this.processedAt = processedAt;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreateSubscriptionCycleDtoIn = CreateSubscriptionCycleDtoIn;
//# sourceMappingURL=create-subscription-cycle.dto-in.js.map