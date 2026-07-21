"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayRecurringPaymentDtoIn = void 0;
class GatewayRecurringPaymentDtoIn {
    gatewayProvider;
    gatewaySlug;
    subscriptionPlan;
    subscription;
    subscriptionInvoice;
    paymentTransaction;
    apiCredential;
    providerPayload;
    idempotencyKey;
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
        this.subscriptionPlan = params.subscriptionPlan;
        this.subscription = params.subscription;
        this.subscriptionInvoice = params.subscriptionInvoice;
        this.paymentTransaction = params.paymentTransaction;
        this.apiCredential = params.apiCredential;
        this.providerPayload = params.providerPayload;
        this.idempotencyKey = params.idempotencyKey;
        this.config = params.config ?? {};
    }
}
exports.GatewayRecurringPaymentDtoIn = GatewayRecurringPaymentDtoIn;
//# sourceMappingURL=gateway-recurring-payment.dto-in.js.map