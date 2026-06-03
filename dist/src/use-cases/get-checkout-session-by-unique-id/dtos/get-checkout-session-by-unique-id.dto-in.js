"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCheckoutSessionByUniqueIdDtoIn = void 0;
class GetCheckoutSessionByUniqueIdDtoIn {
    token;
    checkoutSessionId;
    constructor(params) {
        this.token = params.token ?? '';
        this.checkoutSessionId = params.checkoutSessionId ?? '';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
    }
}
exports.GetCheckoutSessionByUniqueIdDtoIn = GetCheckoutSessionByUniqueIdDtoIn;
//# sourceMappingURL=get-checkout-session-by-unique-id.dto-in.js.map