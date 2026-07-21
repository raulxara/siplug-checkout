"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSubscriptionByUniqueIdDtoIn = void 0;
class GetSubscriptionByUniqueIdDtoIn {
    token;
    subscriptionId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.subscriptionId = String(params.subscriptionId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.subscriptionId === '') {
            throw new Error('subscriptionId is required');
        }
    }
}
exports.GetSubscriptionByUniqueIdDtoIn = GetSubscriptionByUniqueIdDtoIn;
//# sourceMappingURL=get-subscription-by-unique-id.dto-in.js.map