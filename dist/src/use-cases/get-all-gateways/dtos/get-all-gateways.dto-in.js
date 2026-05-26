"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllGatewaysDtoIn = void 0;
class GetAllGatewaysDtoIn {
    token;
    status;
    search;
    page;
    perPage;
    constructor(params) {
        this.token = params.token ?? '';
        this.status = params.status ?? null;
        this.search = params.search ?? null;
        this.page = params.page && params.page > 0 ? params.page : 1;
        this.perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.perPage > 100) {
            throw new Error('perPage cannot be greater than 100');
        }
    }
}
exports.GetAllGatewaysDtoIn = GetAllGatewaysDtoIn;
//# sourceMappingURL=get-all-gateways.dto-in.js.map