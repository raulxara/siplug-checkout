"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCheckoutSessionDtoIn = void 0;
class UpdateCheckoutSessionDtoIn {
    _id;
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
    source;
    constructor(params) {
        this._id = params._id;
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
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateCheckoutSessionService';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateCheckoutSessionDtoIn = UpdateCheckoutSessionDtoIn;
//# sourceMappingURL=update-checkout-session.dto-in.js.map