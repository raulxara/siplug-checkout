"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckoutSessionsDtoOut = void 0;
class ListCheckoutSessionsDtoOut {
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
exports.ListCheckoutSessionsDtoOut = ListCheckoutSessionsDtoOut;
//# sourceMappingURL=list-checkout-sessions.dto-out.js.map