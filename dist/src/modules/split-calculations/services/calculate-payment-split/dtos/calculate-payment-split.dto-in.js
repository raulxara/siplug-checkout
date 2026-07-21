"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePaymentSplitDtoIn = void 0;
class CalculatePaymentSplitDtoIn {
    splitRuleId;
    grossAmount;
    gatewayFeeAmount;
    netAmount;
    currency;
    metadata;
    constructor(splitRuleId, grossAmount, gatewayFeeAmount, netAmount, currency, metadata) {
        this.splitRuleId = splitRuleId;
        this.grossAmount = grossAmount;
        this.gatewayFeeAmount = gatewayFeeAmount;
        this.netAmount = netAmount;
        this.currency = currency;
        this.metadata = metadata;
    }
}
exports.CalculatePaymentSplitDtoIn = CalculatePaymentSplitDtoIn;
//# sourceMappingURL=calculate-payment-split.dto-in.js.map