"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentTransactionDtoIn = void 0;
class CreatePaymentTransactionDtoIn {
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
    constructor(params) {
        this.officeId = params.officeId;
        this.clientId = params.clientId;
        this.checkoutSessionId = params.checkoutSessionId ?? null;
        this.paymentCustomerId = params.paymentCustomerId ?? null;
        this.gatewayId = params.gatewayId;
        this.apiCredentialId = params.apiCredentialId ?? null;
        this.gatewayTransactionId = params.gatewayTransactionId ?? null;
        this.externalReference = params.externalReference ?? null;
        this.idempotencyKey = params.idempotencyKey ?? null;
        this.paymentType = params.paymentType;
        this.paymentMethod = params.paymentMethod;
        this.amount = Number(params.amount);
        this.currency = params.currency ?? 'BRL';
        this.installments = params.installments ?? null;
        this.installmentAmount = params.installmentAmount ?? null;
        this.interestAmount = params.interestAmount ?? null;
        this.interestType = params.interestType ?? null;
        this.gatewayStatus = params.gatewayStatus ?? null;
        this.status = params.status ?? 'created';
        this.processStatus = params.processStatus ?? 'pending';
        this.processMessage = params.processMessage ?? null;
        this.providerPayload = params.providerPayload ?? null;
        this.providerResponse = params.providerResponse ?? null;
        this.gatewayResponse = params.gatewayResponse ?? null;
        this.qrCode = params.qrCode ?? null;
        this.qrCodeBase64 = params.qrCodeBase64 ?? null;
        this.boletoUrl = params.boletoUrl ?? null;
        this.checkoutUrl = params.checkoutUrl ?? null;
        this.splitRequired = params.splitRequired ?? false;
        this.hasSplit = params.hasSplit ?? false;
        this.paidAt = params.paidAt ?? null;
        this.authorizedAt = params.authorizedAt ?? null;
        this.canceledAt = params.canceledAt ?? null;
        this.failedAt = params.failedAt ?? null;
        this.refundedAt = params.refundedAt ?? null;
        this.expiresAt = params.expiresAt ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
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
        if (this.paymentMethod.trim() === '') {
            throw new Error('paymentMethod is required');
        }
        if (!Number.isInteger(this.amount) || this.amount <= 0) {
            throw new Error('amount must be an integer greater than zero');
        }
        if (this.currency.trim() === '') {
            throw new Error('currency is required');
        }
    }
}
exports.CreatePaymentTransactionDtoIn = CreatePaymentTransactionDtoIn;
//# sourceMappingURL=create-payment-transaction.dto-in.js.map