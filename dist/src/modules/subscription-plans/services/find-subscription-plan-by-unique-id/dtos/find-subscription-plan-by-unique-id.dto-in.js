"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSubscriptionPlanByUniqueIdDtoIn = void 0;
class FindSubscriptionPlanByUniqueIdDtoIn {
    subscriptionPlanId;
    constructor(subscriptionPlanId) {
        if (!subscriptionPlanId || subscriptionPlanId.trim() === '') {
            throw new Error('subscriptionPlanId is required');
        }
        this.subscriptionPlanId = subscriptionPlanId.trim();
    }
}
exports.FindSubscriptionPlanByUniqueIdDtoIn = FindSubscriptionPlanByUniqueIdDtoIn;
//# sourceMappingURL=find-subscription-plan-by-unique-id.dto-in.js.map