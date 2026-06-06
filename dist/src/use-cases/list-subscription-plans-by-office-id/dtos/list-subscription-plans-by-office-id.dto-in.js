"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSubscriptionPlansByOfficeIdDtoIn = void 0;
class ListSubscriptionPlansByOfficeIdDtoIn {
    token;
    officeId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.officeId = String(params.officeId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListSubscriptionPlansByOfficeIdDtoIn = ListSubscriptionPlansByOfficeIdDtoIn;
//# sourceMappingURL=list-subscription-plans-by-office-id.dto-in.js.map