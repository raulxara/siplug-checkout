"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn = void 0;
class GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn {
    paymentSplitId;
    constructor(paymentSplitId) {
        this.paymentSplitId = String(paymentSplitId ?? '').trim();
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
    }
}
exports.GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn = GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn;
//# sourceMappingURL=get-all-payment-split-recipients-by-payment-split-id.dto-in.js.map