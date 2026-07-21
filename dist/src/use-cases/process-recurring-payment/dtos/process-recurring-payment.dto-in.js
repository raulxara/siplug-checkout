"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessRecurringPaymentDtoIn = void 0;
class ProcessRecurringPaymentDtoIn {
    token;
    checkoutSessionId;
    paymentMethod;
    gatewayProvider;
    gatewaySlug;
    gatewayId;
    apiCredentialId;
    payer;
    paymentData;
    metadata;
    config;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.checkoutSessionId || params.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
        if (!params.paymentMethod || params.paymentMethod.trim() === '') {
            throw new Error('paymentMethod is required');
        }
        this.token = params.token.trim();
        this.checkoutSessionId = params.checkoutSessionId.trim();
        this.paymentMethod = params.paymentMethod.trim();
        this.gatewayProvider = this.normalizeNullableString(params.gatewayProvider);
        this.gatewaySlug = this.normalizeNullableString(params.gatewaySlug);
        this.gatewayId = this.normalizeNullableString(params.gatewayId);
        this.apiCredentialId = this.normalizeNullableString(params.apiCredentialId);
        this.payer = params.payer ?? null;
        this.paymentData = params.paymentData ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
    }
    normalizeNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.ProcessRecurringPaymentDtoIn = ProcessRecurringPaymentDtoIn;
//# sourceMappingURL=process-recurring-payment.dto-in.js.map