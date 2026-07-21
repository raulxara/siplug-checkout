"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersDtoOut = void 0;
class ListUsersDtoOut {
    items;
    total;
    page;
    perPage;
    totalPages;
    constructor(items, total, page, perPage, totalPages) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.perPage = perPage;
        this.totalPages = totalPages;
    }
}
exports.ListUsersDtoOut = ListUsersDtoOut;
//# sourceMappingURL=list-users.dto-out.js.map