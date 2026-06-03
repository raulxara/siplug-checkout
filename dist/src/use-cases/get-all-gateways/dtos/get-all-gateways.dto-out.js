"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllGatewaysDtoOut = void 0;
class GetAllGatewaysDtoOut {
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
exports.GetAllGatewaysDtoOut = GetAllGatewaysDtoOut;
//# sourceMappingURL=get-all-gateways.dto-out.js.map