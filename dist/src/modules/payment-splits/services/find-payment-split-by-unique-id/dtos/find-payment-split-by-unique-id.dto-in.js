"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPaymentSplitByUniqueIdDtoIn = void 0;
class FindPaymentSplitByUniqueIdDtoIn {
    paymentSplitId;
    constructor(paymentSplitId) {
        this.paymentSplitId = String(paymentSplitId ?? '').trim();
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
    }
}
exports.FindPaymentSplitByUniqueIdDtoIn = FindPaymentSplitByUniqueIdDtoIn;
//# sourceMappingURL=find-payment-split-by-unique-id.dto-in.js.map