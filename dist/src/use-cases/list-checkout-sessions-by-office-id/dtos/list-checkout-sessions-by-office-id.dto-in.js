"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCheckoutSessionsByOfficeIdDtoIn = void 0;
class ListCheckoutSessionsByOfficeIdDtoIn {
    token;
    officeId;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListCheckoutSessionsByOfficeIdDtoIn = ListCheckoutSessionsByOfficeIdDtoIn;
//# sourceMappingURL=list-checkout-sessions-by-office-id.dto-in.js.map