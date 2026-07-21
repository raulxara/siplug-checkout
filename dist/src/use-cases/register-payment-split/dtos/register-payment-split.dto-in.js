"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPaymentSplitDtoIn = void 0;
class RegisterPaymentSplitDtoIn {
    token;
    splitRuleId;
    checkoutSessionId;
    paymentTransactionId;
    subscriptionId;
    subscriptionInvoiceId;
    gatewayProvider;
    grossAmount;
    gatewayFeeAmount;
    netAmount;
    currency;
    metadata;
    config;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRuleId = String(params.splitRuleId ?? '').trim();
        this.checkoutSessionId = this.toNullableString(params.checkoutSessionId);
        this.paymentTransactionId = String(params.paymentTransactionId ?? '').trim();
        this.subscriptionId = this.toNullableString(params.subscriptionId);
        this.subscriptionInvoiceId = this.toNullableString(params.subscriptionInvoiceId);
        this.gatewayProvider = String(params.gatewayProvider ?? '').trim();
        this.grossAmount = this.toRequiredInteger(params.grossAmount, 'grossAmount');
        this.gatewayFeeAmount = this.toNullableInteger(params.gatewayFeeAmount);
        this.netAmount = this.toNullableInteger(params.netAmount);
        this.currency = String(params.currency ?? 'BRL').trim().toUpperCase();
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
        if (this.paymentTransactionId === '') {
            throw new Error('paymentTransactionId is required');
        }
        if (this.gatewayProvider === '') {
            throw new Error('gatewayProvider is required');
        }
        if (this.currency === '') {
            throw new Error('currency is required');
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toRequiredInteger(value, field) {
        if (value === undefined || value === null || value === '') {
            throw new Error(`${field} is required`);
        }
        const numberValue = Number(value);
        if (!Number.isInteger(numberValue)) {
            throw new Error(`${field} must be an integer amount in cents`);
        }
        if (numberValue < 0) {
            throw new Error(`${field} cannot be negative`);
        }
        return numberValue;
    }
    toNullableInteger(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (!Number.isInteger(numberValue)) {
            throw new Error('amount must be an integer amount in cents');
        }
        if (numberValue < 0) {
            throw new Error('amount cannot be negative');
        }
        return numberValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.RegisterPaymentSplitDtoIn = RegisterPaymentSplitDtoIn;
//# sourceMappingURL=register-payment-split.dto-in.js.map