"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPaymentStatusDtoOut = void 0;
class GatewayPaymentStatusDtoOut {
    success;
    provider;
    gatewayTransactionId;
    gatewayStatus;
    status;
    processStatus;
    processMessage;
    providerRequest;
    providerResponse;
    gatewayResponse;
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
    constructor(success, provider, gatewayTransactionId, gatewayStatus, status, processStatus, processMessage, providerRequest, providerResponse, gatewayResponse, qrCode = null, qrCodeBase64 = null, boletoUrl = null, checkoutUrl = null, paidAt = null, authorizedAt = null, canceledAt = null, failedAt = null, refundedAt = null, expiresAt = null) {
        this.success = success;
        this.provider = provider;
        this.gatewayTransactionId = gatewayTransactionId;
        this.gatewayStatus = gatewayStatus;
        this.status = status;
        this.processStatus = processStatus;
        this.processMessage = processMessage;
        this.providerRequest = providerRequest;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.qrCode = qrCode;
        this.qrCodeBase64 = qrCodeBase64;
        this.boletoUrl = boletoUrl;
        this.checkoutUrl = checkoutUrl;
        this.paidAt = paidAt;
        this.authorizedAt = authorizedAt;
        this.canceledAt = canceledAt;
        this.failedAt = failedAt;
        this.refundedAt = refundedAt;
        this.expiresAt = expiresAt;
    }
}
exports.GatewayPaymentStatusDtoOut = GatewayPaymentStatusDtoOut;
//# sourceMappingURL=gateway-payment-status.dto-out.js.map