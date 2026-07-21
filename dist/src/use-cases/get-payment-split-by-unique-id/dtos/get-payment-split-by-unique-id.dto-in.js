"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPaymentSplitByUniqueIdDtoIn = void 0;
class GetPaymentSplitByUniqueIdDtoIn {
    token;
    paymentSplitId;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
    }
}
exports.GetPaymentSplitByUniqueIdDtoIn = GetPaymentSplitByUniqueIdDtoIn;
//# sourceMappingURL=get-payment-split-by-unique-id.dto-in.js.map