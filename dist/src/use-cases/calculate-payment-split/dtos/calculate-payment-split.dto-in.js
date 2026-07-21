"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatePaymentSplitDtoIn = void 0;
class CalculatePaymentSplitDtoIn {
    token;
    splitRuleId;
    grossAmount;
    gatewayFeeAmount;
    netAmount;
    currency;
    metadata;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRuleId = String(params.splitRuleId ?? '').trim();
        this.grossAmount = this.toRequiredInteger(params.grossAmount, 'grossAmount');
        this.gatewayFeeAmount = this.toNullableInteger(params.gatewayFeeAmount);
        this.netAmount = this.toNullableInteger(params.netAmount);
        this.currency = String(params.currency ?? 'BRL').trim().toUpperCase();
        this.metadata = this.toNullableObject(params.metadata);
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRuleId === '') {
            throw new Error('splitRuleId is required');
        }
        if (this.currency === '') {
            throw new Error('currency is required');
        }
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
            throw new Error('metadata must be an object');
        }
        return value;
    }
}
exports.CalculatePaymentSplitDtoIn = CalculatePaymentSplitDtoIn;
//# sourceMappingURL=calculate-payment-split.dto-in.js.map