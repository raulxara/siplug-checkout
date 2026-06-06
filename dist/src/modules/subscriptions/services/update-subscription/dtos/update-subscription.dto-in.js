"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionDtoIn = void 0;
class UpdateSubscriptionDtoIn {
    _id;
    currentCycle;
    nextBillingAt;
    startedAt;
    canceledAt;
    endedAt;
    metadata;
    config;
    status;
    source;
    gatewaySubscriptionId;
    constructor(_id, currentCycle, nextBillingAt, startedAt, canceledAt, endedAt, metadata, config, status, source, gatewaySubscriptionId = null) {
        this._id = _id;
        this.currentCycle = currentCycle;
        this.nextBillingAt = nextBillingAt;
        this.startedAt = startedAt;
        this.canceledAt = canceledAt;
        this.endedAt = endedAt;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
        this.source = source;
        this.gatewaySubscriptionId = gatewaySubscriptionId;
    }
}
exports.UpdateSubscriptionDtoIn = UpdateSubscriptionDtoIn;
//# sourceMappingURL=update-subscription.dto-in.js.map