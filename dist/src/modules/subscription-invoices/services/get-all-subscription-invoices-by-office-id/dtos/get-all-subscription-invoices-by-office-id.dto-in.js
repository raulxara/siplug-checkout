"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllSubscriptionInvoicesByOfficeIdDtoIn = void 0;
class GetAllSubscriptionInvoicesByOfficeIdDtoIn {
    officeId;
    constructor(officeId) {
        this.officeId = String(officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.GetAllSubscriptionInvoicesByOfficeIdDtoIn = GetAllSubscriptionInvoicesByOfficeIdDtoIn;
//# sourceMappingURL=get-all-subscription-invoices-by-office-id.dto-in.js.map