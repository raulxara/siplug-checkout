"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentSplitDispatchEligibilityDtoIn = void 0;
class ResolvePaymentSplitDispatchEligibilityDtoIn {
    paymentSplitId;
    source;
    constructor(params) {
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        this.source = String(params.source ?? 'ResolvePaymentSplitDispatchEligibilityService').trim();
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
    }
}
exports.ResolvePaymentSplitDispatchEligibilityDtoIn = ResolvePaymentSplitDispatchEligibilityDtoIn;
//# sourceMappingURL=resolve-payment-split-dispatch-eligibility.dto-in.js.map