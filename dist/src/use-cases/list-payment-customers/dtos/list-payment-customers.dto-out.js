"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentCustomersDtoOut = void 0;
class ListPaymentCustomersDtoOut {
    officeId;
    items;
    total;
    page;
    perPage;
    totalPages;
    constructor(officeId, items, total, page, perPage, totalPages) {
        this.officeId = officeId;
        this.items = items;
        this.total = total;
        this.page = page;
        this.perPage = perPage;
        this.totalPages = totalPages;
    }
}
exports.ListPaymentCustomersDtoOut = ListPaymentCustomersDtoOut;
//# sourceMappingURL=list-payment-customers.dto-out.js.map