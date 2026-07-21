"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPaymentDtoIn = void 0;
class ProcessPaymentDtoIn {
    token;
    checkoutSessionId;
    paymentMethod;
    installments;
    installmentAmount;
    interestAmount;
    interestType;
    idempotencyKey;
    externalReference;
    payer;
    paymentData;
    metadata;
    config;
    gatewayProvider;
    gatewaySlug;
    gatewayId;
    apiCredentialId;
    constructor(params) {
        this.token = params.token ?? '';
        this.checkoutSessionId = params.checkoutSessionId ?? '';
        this.paymentMethod = params.paymentMethod ?? '';
        this.installments = params.installments ?? null;
        this.installmentAmount = params.installmentAmount ?? null;
        this.interestAmount = params.interestAmount ?? null;
        this.interestType = params.interestType ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.externalReference = params.externalReference ?? null;
        this.payer = params.payer ?? null;
        this.paymentData = params.paymentData ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.gatewayProvider =
            params.gatewayProvider !== undefined && params.gatewayProvider !== null
                ? String(params.gatewayProvider).trim()
                : null;
        this.gatewaySlug =
            params.gatewaySlug !== undefined && params.gatewaySlug !== null
                ? String(params.gatewaySlug).trim()
                : null;
        this.gatewayId =
            params.gatewayId !== undefined && params.gatewayId !== null
                ? String(params.gatewayId).trim()
                : null;
        this.apiCredentialId =
            params.apiCredentialId !== undefined && params.apiCredentialId !== null
                ? String(params.apiCredentialId).trim()
                : null;
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
        if (this.paymentMethod.trim() === '') {
            throw new Error('paymentMethod is required');
        }
        if (this.installments !== null) {
            if (!Number.isInteger(this.installments) || this.installments <= 0) {
                throw new Error('installments must be an integer greater than zero');
            }
        }
        if (this.installmentAmount !== null) {
            if (!Number.isInteger(this.installmentAmount) ||
                this.installmentAmount <= 0) {
                throw new Error('installmentAmount must be an integer greater than zero');
            }
        }
        if (this.interestAmount !== null) {
            if (!Number.isInteger(this.interestAmount) || this.interestAmount < 0) {
                throw new Error('interestAmount must be an integer greater than or equal to zero');
            }
        }
    }
}
exports.ProcessPaymentDtoIn = ProcessPaymentDtoIn;
//# sourceMappingURL=process-payment.dto-in.js.map