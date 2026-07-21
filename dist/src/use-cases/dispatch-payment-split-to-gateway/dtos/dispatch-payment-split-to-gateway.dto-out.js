"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchPaymentSplitToGatewayDtoOut = void 0;
class DispatchPaymentSplitToGatewayDtoOut {
    dispatched;
    reason;
    paymentSplit;
    paymentSplitRecipients;
    gatewayResult;
    constructor(dispatched, reason, paymentSplit, paymentSplitRecipients, gatewayResult) {
        this.dispatched = dispatched;
        this.reason = reason;
        this.paymentSplit = paymentSplit;
        this.paymentSplitRecipients = paymentSplitRecipients;
        this.gatewayResult = gatewayResult;
    }
}
exports.DispatchPaymentSplitToGatewayDtoOut = DispatchPaymentSplitToGatewayDtoOut;
//# sourceMappingURL=dispatch-payment-split-to-gateway.dto-out.js.map