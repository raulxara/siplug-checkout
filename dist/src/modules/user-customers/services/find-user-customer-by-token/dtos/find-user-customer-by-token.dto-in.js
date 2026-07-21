"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserCustomerByTokenDtoIn = void 0;
class FindUserCustomerByTokenDtoIn {
    token;
    constructor(token) {
        this.token = token;
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
    }
}
exports.FindUserCustomerByTokenDtoIn = FindUserCustomerByTokenDtoIn;
//# sourceMappingURL=find-user-customer-by-token.dto-in.js.map