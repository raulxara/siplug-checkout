"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubscriptionsByOfficeIdDtoIn = void 0;
class GetAllSubscriptionsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllSubscriptionsByOfficeIdDtoIn = GetAllSubscriptionsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-subscriptions-by-office-id.dto-in.js.map