"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPaymentDtoIn = void 0;
class GatewayPaymentDtoIn {
    gatewayProvider;
    gatewaySlug;
    paymentTransaction;
    apiCredential;
    providerPayload;
    idempotencyKey;
    config;
    constructor(params) {
        this.gatewayProvider = params.gatewayProvider;
        this.gatewaySlug = params.gatewaySlug;
        this.paymentTransaction = params.paymentTransaction;
        this.apiCredential = params.apiCredential ?? null;
        this.providerPayload = params.providerPayload ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.config = params.config ?? null;
        if (this.gatewayProvider.trim() === '') {
            throw new Error('gatewayProvider is required');
        }
        if (this.gatewaySlug.trim() === '') {
            throw new Error('gatewaySlug is required');
        }
        if (!this.paymentTransaction._id ||
            this.paymentTransaction._id.trim() === '') {
            throw new Error('paymentTransaction._id is required');
        }
    }
}
exports.GatewayPaymentDtoIn = GatewayPaymentDtoIn;
//# sourceMappingURL=gateway-payment.dto-in.js.map