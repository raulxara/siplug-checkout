"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPaymentTransactionByGatewayTransactionIdDtoIn = void 0;
class FindPaymentTransactionByGatewayTransactionIdDtoIn {
    gatewayTransactionId;
    constructor(gatewayTransactionId) {
        this.gatewayTransactionId = gatewayTransactionId;
        if (this.gatewayTransactionId.trim() === '') {
            throw new Error('gatewayTransactionId is required');
        }
    }
}
exports.FindPaymentTransactionByGatewayTransactionIdDtoIn = FindPaymentTransactionByGatewayTransactionIdDtoIn;
//# sourceMappingURL=find-payment-transaction-by-gateway-transaction-id.dto-in.js.map