"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCheckoutSessionDtoIn = void 0;
class RegisterCheckoutSessionDtoIn {
    token;
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
    items;
    metadata;
    config;
    status;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? '';
        this.clientId = params.clientId ?? '';
        this.paymentCustomerId = params.paymentCustomerId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.code = params.code ?? null;
        this.externalReference = params.externalReference ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.paymentType = params.paymentType ?? '';
        this.amount = Number(params.amount ?? 0);
        this.currency = params.currency ?? 'BRL';
        this.description = params.description ?? null;
        this.successUrl = params.successUrl ?? null;
        this.cancelUrl = params.cancelUrl ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.items = params.items ?? [];
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'created';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (this.paymentType.trim() === '') {
            throw new Error('paymentType is required');
        }
        if (!Number.isInteger(this.amount) || this.amount <= 0) {
            throw new Error('amount must be an integer greater than zero');
        }
        if (this.currency.trim() === '') {
            throw new Error('currency is required');
        }
        if (!Array.isArray(this.items) || this.items.length === 0) {
            throw new Error('items is required');
        }
        for (const item of this.items) {
            if (!item.name || item.name.trim() === '') {
                throw new Error('item.name is required');
            }
            const quantity = item.quantity ?? 1;
            const unitAmount = Number(item.unitAmount);
            const totalAmount = Number(item.totalAmount ?? quantity * unitAmount);
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('item.quantity must be an integer greater than zero');
            }
            if (!Number.isInteger(unitAmount) || unitAmount <= 0) {
                throw new Error('item.unitAmount must be an integer greater than zero');
            }
            if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
                throw new Error('item.totalAmount must be an integer greater than zero');
            }
        }
    }
}
exports.RegisterCheckoutSessionDtoIn = RegisterCheckoutSessionDtoIn;
//# sourceMappingURL=register-checkout-session.dto-in.js.map