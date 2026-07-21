"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePaymentSplitDtoOut = void 0;
class CalculatePaymentSplitDtoOut {
    splitRule;
    calculationBase;
    grossAmount;
    gatewayFeeAmount;
    netAmount;
    baseAmount;
    allocatedAmount;
    unallocatedAmount;
    currency;
    recipients;
    metadata;
    constructor(splitRule, calculationBase, grossAmount, gatewayFeeAmount, netAmount, baseAmount, allocatedAmount, unallocatedAmount, currency, recipients, metadata) {
        this.splitRule = splitRule;
        this.calculationBase = calculationBase;
        this.grossAmount = grossAmount;
        this.gatewayFeeAmount = gatewayFeeAmount;
        this.netAmount = netAmount;
        this.baseAmount = baseAmount;
        this.allocatedAmount = allocatedAmount;
        this.unallocatedAmount = unallocatedAmount;
        this.currency = currency;
        this.recipients = recipients;
        this.metadata = metadata;
    }
}
exports.CalculatePaymentSplitDtoOut = CalculatePaymentSplitDtoOut;
//# sourceMappingURL=calculate-payment-split.dto-out.js.map