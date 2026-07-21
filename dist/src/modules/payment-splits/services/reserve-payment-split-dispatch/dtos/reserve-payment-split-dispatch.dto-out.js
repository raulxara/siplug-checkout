"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservePaymentSplitDispatchDtoOut = void 0;
class ReservePaymentSplitDispatchDtoOut {
    reserved;
    reason;
    paymentSplitId;
    previousStatus;
    currentStatus;
    reservation;
    paymentSplit;
    constructor(reserved, reason, paymentSplitId, previousStatus, currentStatus, reservation, paymentSplit) {
        this.reserved = reserved;
        this.reason = reason;
        this.paymentSplitId = paymentSplitId;
        this.previousStatus = previousStatus;
        this.currentStatus = currentStatus;
        this.reservation = reservation;
        this.paymentSplit = paymentSplit;
    }
}
exports.ReservePaymentSplitDispatchDtoOut = ReservePaymentSplitDispatchDtoOut;
//# sourceMappingURL=reserve-payment-split-dispatch.dto-out.js.map