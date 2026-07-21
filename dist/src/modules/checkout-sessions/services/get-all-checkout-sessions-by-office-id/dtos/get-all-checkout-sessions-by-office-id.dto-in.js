"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCheckoutSessionsByOfficeIdDtoIn = void 0;
class GetAllCheckoutSessionsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = officeId;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllCheckoutSessionsByOfficeIdDtoIn = GetAllCheckoutSessionsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-checkout-sessions-by-office-id.dto-in.js.map