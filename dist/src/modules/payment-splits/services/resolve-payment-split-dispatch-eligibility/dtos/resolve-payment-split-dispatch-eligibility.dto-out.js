"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentSplitDispatchEligibilityDtoOut = void 0;
class ResolvePaymentSplitDispatchEligibilityDtoOut {
    eligible;
    reason;
    paymentSplitId;
    currentStatus;
    paymentSplit;
    constructor(eligible, reason, paymentSplitId, currentStatus, paymentSplit) {
        this.eligible = eligible;
        this.reason = reason;
        this.paymentSplitId = paymentSplitId;
        this.currentStatus = currentStatus;
        this.paymentSplit = paymentSplit;
    }
}
exports.ResolvePaymentSplitDispatchEligibilityDtoOut = ResolvePaymentSplitDispatchEligibilityDtoOut;
//# sourceMappingURL=resolve-payment-split-dispatch-eligibility.dto-out.js.map