"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn = void 0;
class GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn {
    checkoutSessionId;
    constructor(checkoutSessionId) {
        this.checkoutSessionId = checkoutSessionId;
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
    }
}
exports.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn = GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn;
//# sourceMappingURL=get-all-checkout-session-items-by-checkout-session-id.dto-in.js.map