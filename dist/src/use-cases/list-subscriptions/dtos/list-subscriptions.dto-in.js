"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionsDtoIn = void 0;
class ListSubscriptionsDtoIn {
    token;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
    }
}
exports.ListSubscriptionsDtoIn = ListSubscriptionsDtoIn;
//# sourceMappingURL=list-subscriptions.dto-in.js.map