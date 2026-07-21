"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubscriptionPlansByOfficeIdDtoIn = void 0;
class GetAllSubscriptionPlansByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllSubscriptionPlansByOfficeIdDtoIn = GetAllSubscriptionPlansByOfficeIdDtoIn;
//# sourceMappingURL=get-all-subscription-plans-by-office-id.dto-in.js.map