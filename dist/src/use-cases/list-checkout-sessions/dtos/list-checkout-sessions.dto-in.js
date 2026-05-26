"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckoutSessionsDtoIn = void 0;
class ListCheckoutSessionsDtoIn {
    token;
    officeId;
    status;
    search;
    page;
    perPage;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? '';
        this.status = params.status ?? null;
        this.search = params.search ?? null;
        this.page = params.page && params.page > 0 ? params.page : 1;
        this.perPage = params.perPage && params.perPage > 0 ? params.perPage : 20;
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.perPage > 100) {
            throw new Error('perPage cannot be greater than 100');
        }
    }
}
exports.ListCheckoutSessionsDtoIn = ListCheckoutSessionsDtoIn;
//# sourceMappingURL=list-checkout-sessions.dto-in.js.map