"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionPlansDtoIn = void 0;
class ListSubscriptionPlansDtoIn {
    token;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
    }
}
exports.ListSubscriptionPlansDtoIn = ListSubscriptionPlansDtoIn;
//# sourceMappingURL=list-subscription-plans.dto-in.js.map