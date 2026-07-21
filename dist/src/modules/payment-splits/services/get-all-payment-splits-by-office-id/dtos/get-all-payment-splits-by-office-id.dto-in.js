"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentSplitsByOfficeIdDtoIn = void 0;
class GetAllPaymentSplitsByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllPaymentSplitsByOfficeIdDtoIn = GetAllPaymentSplitsByOfficeIdDtoIn;
//# sourceMappingURL=get-all-payment-splits-by-office-id.dto-in.js.map