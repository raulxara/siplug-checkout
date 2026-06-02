"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentTransactionUseCaseDtoIn = void 0;
class UpdatePaymentTransactionUseCaseDtoIn {
    token;
    paymentTransactionId;
    status;
    gatewayStatus;
    processStatus;
    processMessage;
    qrCode;
    qrCodeBase64;
    boletoUrl;
    checkoutUrl;
    paidAt;
    authorizedAt;
    canceledAt;
    failedAt;
    refundedAt;
    expiresAt;
    metadata;
    config;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.paymentTransactionId ||
            params.paymentTransactionId.trim() === '') {
            throw new Error('paymentTransactionId is required');
        }
        this.token = params.token.trim();
        this.paymentTransactionId = params.paymentTransactionId.trim();
        this.status = this.normalizeNullableString(params.status);
        this.gatewayStatus = this.normalizeNullableString(params.gatewayStatus);
        this.processStatus = this.normalizeNullableString(params.processStatus);
        this.processMessage = this.normalizeNullableString(params.processMessage);
        this.qrCode = this.normalizeNullableString(params.qrCode);
        this.qrCodeBase64 = this.normalizeNullableString(params.qrCodeBase64);
        this.boletoUrl = this.normalizeNullableString(params.boletoUrl);
        this.checkoutUrl = this.normalizeNullableString(params.checkoutUrl);
        this.paidAt = this.normalizeNullableString(params.paidAt);
        this.authorizedAt = this.normalizeNullableString(params.authorizedAt);
        this.canceledAt = this.normalizeNullableString(params.canceledAt);
        this.failedAt = this.normalizeNullableString(params.failedAt);
        this.refundedAt = this.normalizeNullableString(params.refundedAt);
        this.expiresAt = this.normalizeNullableString(params.expiresAt);
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
    }
    normalizeNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.UpdatePaymentTransactionUseCaseDtoIn = UpdatePaymentTransactionUseCaseDtoIn;
//# sourceMappingURL=update-payment-transaction.dto-in.js.map