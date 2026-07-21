"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersByOfficeIdDtoOut = void 0;
class GetAllUsersByOfficeIdDtoOut {
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
exports.GetAllUsersByOfficeIdDtoOut = GetAllUsersByOfficeIdDtoOut;
//# sourceMappingURL=get-all-users-by-office-id.dto-out.js.map