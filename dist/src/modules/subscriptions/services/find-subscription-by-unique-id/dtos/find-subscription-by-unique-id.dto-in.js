"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSubscriptionByUniqueIdDtoIn = void 0;
class FindSubscriptionByUniqueIdDtoIn {
    subscriptionId;
    constructor(subscriptionId) {
        if (!subscriptionId || subscriptionId.trim() === '') {
            throw new Error('subscriptionId is required');
        }
        this.subscriptionId = subscriptionId.trim();
    }
}
exports.FindSubscriptionByUniqueIdDtoIn = FindSubscriptionByUniqueIdDtoIn;
//# sourceMappingURL=find-subscription-by-unique-id.dto-in.js.map