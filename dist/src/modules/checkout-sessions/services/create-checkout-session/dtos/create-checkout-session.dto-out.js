"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionDtoOut = void 0;
class CreateCheckoutSessionDtoOut {
    id;
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
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, clientId, paymentCustomerId, gatewayId, apiCredentialId, code, externalReference, idempotencyKey, paymentType, amount, currency, description, successUrl, cancelUrl, expiresAt, metadata, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.clientId = clientId;
        this.paymentCustomerId = paymentCustomerId;
        this.gatewayId = gatewayId;
        this.apiCredentialId = apiCredentialId;
        this.code = code;
        this.externalReference = externalReference;
        this.idempotencyKey = idempotencyKey;
        this.paymentType = paymentType;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
        this.expiresAt = expiresAt;
        this.metadata = metadata;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateCheckoutSessionDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.clientId, entity.paymentCustomerId, entity.gatewayId, entity.apiCredentialId, entity.code, entity.externalReference, entity.idempotencyKey, entity.paymentType, entity.amount, entity.currency, entity.description, entity.successUrl, entity.cancelUrl, entity.expiresAt, entity.metadata, entity.config, entity.changesHistory, entity.status ?? 'created', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateCheckoutSessionDtoOut = CreateCheckoutSessionDtoOut;
//# sourceMappingURL=create-checkout-session.dto-out.js.map