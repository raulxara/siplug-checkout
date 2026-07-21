"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentTransactionDtoIn = void 0;
class UpdatePaymentTransactionDtoIn {
    _id;
    officeId;
    clientId;
    checkoutSessionId;
    paymentCustomerId;
    gatewayId;
    apiCredentialId;
    gatewayTransactionId;
    externalReference;
    idempotencyKey;
    paymentType;
    paymentMethod;
    amount;
    currency;
    installments;
    installmentAmount;
    interestAmount;
    interestType;
    gatewayStatus;
    status;
    processStatus;
    processMessage;
    providerPayload;
    providerResponse;
    gatewayResponse;
    qrCode;
    qrCodeBase64;
    boletoUrl;
    checkoutUrl;
    splitRequired;
    hasSplit;
    paidAt;
    authorizedAt;
    canceledAt;
    failedAt;
    refundedAt;
    expiresAt;
    metadata;
    config;
    source;
    constructor(params) {
        this._id = params._id;
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.checkoutSessionId = params.checkoutSessionId ?? null;
        this.paymentCustomerId = params.paymentCustomerId ?? null;
        this.gatewayId = params.gatewayId ?? null;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.gatewayTransactionId = params.gatewayTransactionId ?? null;
        this.externalReference = params.externalReference ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.paymentType = params.paymentType ?? null;
        this.paymentMethod = params.paymentMethod ?? null;
        this.amount = params.amount ?? null;
        this.currency = params.currency ?? null;
        this.installments = params.installments ?? null;
        this.installmentAmount = params.installmentAmount ?? null;
        this.interestAmount = params.interestAmount ?? null;
        this.interestType = params.interestType ?? null;
        this.gatewayStatus = params.gatewayStatus ?? null;
        this.status = params.status ?? null;
        this.processStatus = params.processStatus ?? null;
        this.processMessage = params.processMessage ?? null;
        this.providerPayload = params.providerPayload ?? null;
        this.providerResponse = params.providerResponse ?? null;
        this.gatewayResponse = params.gatewayResponse ?? null;
        this.qrCode = params.qrCode ?? null;
        this.qrCodeBase64 = params.qrCodeBase64 ?? null;
        this.boletoUrl = params.boletoUrl ?? null;
        this.checkoutUrl = params.checkoutUrl ?? null;
        this.splitRequired = params.splitRequired ?? null;
        this.hasSplit = params.hasSplit ?? null;
        this.paidAt = params.paidAt ?? null;
        this.authorizedAt = params.authorizedAt ?? null;
        this.canceledAt = params.canceledAt ?? null;
        this.failedAt = params.failedAt ?? null;
        this.refundedAt = params.refundedAt ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.source = params.source ?? 'UpdatePaymentTransactionService';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
        if (this.amount !== null) {
            if (!Number.isInteger(this.amount) || this.amount <= 0) {
                throw new Error('amount must be an integer greater than zero');
            }
        }
    }
}
exports.UpdatePaymentTransactionDtoIn = UpdatePaymentTransactionDtoIn;
//# sourceMappingURL=update-payment-transaction.dto-in.js.map