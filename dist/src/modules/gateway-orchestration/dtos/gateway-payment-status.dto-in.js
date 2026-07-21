"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPaymentStatusDtoIn = void 0;
class GatewayPaymentStatusDtoIn {
    gatewayProvider;
    gatewaySlug;
    paymentTransaction;
    apiCredential;
    config;
    constructor(params) {
        if (!params.gatewayProvider || params.gatewayProvider.trim() === '') {
            throw new Error('gatewayProvider is required');
        }
        if (!params.gatewaySlug || params.gatewaySlug.trim() === '') {
            throw new Error('gatewaySlug is required');
        }
        this.gatewayProvider = params.gatewayProvider.trim();
        this.gatewaySlug = params.gatewaySlug.trim();
        this.paymentTransaction = params.paymentTransaction;
        this.apiCredential = params.apiCredential;
        this.config = params.config ?? {};
    }
}
exports.GatewayPaymentStatusDtoIn = GatewayPaymentStatusDtoIn;
//# sourceMappingURL=gateway-payment-status.dto-in.js.map