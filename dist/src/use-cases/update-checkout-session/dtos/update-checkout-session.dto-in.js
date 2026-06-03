"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCheckoutSessionDtoIn = void 0;
class UpdateCheckoutSessionDtoIn {
    token;
    checkoutSessionId;
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
    source;
    constructor(params) {
        this.token = params.token ?? '';
        this.checkoutSessionId = params.checkoutSessionId ?? '';
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.paymentCustomerId = params.paymentCustomerId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.code = params.code ?? null;
        this.externalReference = params.externalReference ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.paymentType = params.paymentType ?? null;
        this.amount = params.amount ?? null;
        this.currency = params.currency ?? null;
        this.description = params.description ?? null;
        this.successUrl = params.successUrl ?? null;
        this.cancelUrl = params.cancelUrl ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.items = params.items ?? [];
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateCheckoutSessionUseCase';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.checkoutSessionId.trim() === '') {
            throw new Error('checkoutSessionId is required');
        }
        if (this.amount !== null) {
            if (!Number.isInteger(this.amount) || this.amount <= 0) {
                throw new Error('amount must be an integer greater than zero');
            }
        }
        for (const item of this.items) {
            if (!item.checkoutSessionItemId || item.checkoutSessionItemId.trim() === '') {
                throw new Error('item.checkoutSessionItemId is required');
            }
            if (item.quantity !== undefined && item.quantity !== null) {
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    throw new Error('item.quantity must be an integer greater than zero');
                }
            }
            if (item.unitAmount !== undefined && item.unitAmount !== null) {
                if (!Number.isInteger(item.unitAmount) || item.unitAmount <= 0) {
                    throw new Error('item.unitAmount must be an integer greater than zero');
                }
            }
            if (item.totalAmount !== undefined && item.totalAmount !== null) {
                if (!Number.isInteger(item.totalAmount) || item.totalAmount <= 0) {
                    throw new Error('item.totalAmount must be an integer greater than zero');
                }
            }
        }
    }
}
exports.UpdateCheckoutSessionDtoIn = UpdateCheckoutSessionDtoIn;
//# sourceMappingURL=update-checkout-session.dto-in.js.map