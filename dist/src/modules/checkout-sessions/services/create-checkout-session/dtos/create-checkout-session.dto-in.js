"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionDtoIn = void 0;
class CreateCheckoutSessionDtoIn {
    officeId;
    clientId;
    paymentCustomerId;
    gatewayId;
    apiCredentialId;
    code;
    externalReference;
    idempotencyKey;
    paymentType;
    amount;
    currency;
    description;
    successUrl;
    cancelUrl;
    expiresAt;
    metadata;
    config;
    status;
    constructor(params) {
        this.officeId = params.officeId;
        this.clientId = params.clientId;
        this.paymentCustomerId = params.paymentCustomerId ?? null;
        this.gatewayId = params.gatewayId;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.code = params.code ?? null;
        this.externalReference = params.externalReference ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.paymentType = params.paymentType;
        this.amount = Number(params.amount);
        this.currency = params.currency ?? 'BRL';
        this.description = params.description ?? null;
        this.successUrl = params.successUrl ?? null;
        this.cancelUrl = params.cancelUrl ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'created';
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (this.gatewayId.trim() === '') {
            throw new Error('gatewayId is required');
        }
        if (this.paymentType.trim() === '') {
            throw new Error('paymentType is required');
        }
        if (!Number.isFinite(this.amount) || this.amount <= 0) {
            throw new Error('amount must be greater than zero');
        }
        if (this.currency.trim() === '') {
            throw new Error('currency is required');
        }
    }
}
exports.CreateCheckoutSessionDtoIn = CreateCheckoutSessionDtoIn;
//# sourceMappingURL=create-checkout-session.dto-in.js.map