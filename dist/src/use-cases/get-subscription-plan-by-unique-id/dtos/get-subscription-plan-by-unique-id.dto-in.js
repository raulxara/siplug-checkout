"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionPlanByUniqueIdDtoIn = void 0;
class GetSubscriptionPlanByUniqueIdDtoIn {
    token;
    subscriptionPlanId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionPlanId = String(params.subscriptionPlanId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionPlanId === '') {
            throw new Error('subscriptionPlanId is required');
        }
    }
}
exports.GetSubscriptionPlanByUniqueIdDtoIn = GetSubscriptionPlanByUniqueIdDtoIn;
//# sourceMappingURL=get-subscription-plan-by-unique-id.dto-in.js.map