"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMercadoPagoPaymentDtoOut = void 0;
class FetchMercadoPagoPaymentDtoOut {
    gatewayTransactionId;
    gatewayStatus;
    status;
    processStatus;
    processMessage;
    providerResponse;
    gatewayResponse;
    qrCode;
    qrCodeBase64;
    checkoutUrl;
    paidAt;
    authorizedAt;
    canceledAt;
    failedAt;
    refundedAt;
    expiresAt;
    constructor(gatewayTransactionId, gatewayStatus, status, processStatus, processMessage, providerResponse, gatewayResponse, qrCode, qrCodeBase64, checkoutUrl, paidAt, authorizedAt, canceledAt, failedAt, refundedAt, expiresAt) {
        this.gatewayTransactionId = gatewayTransactionId;
        this.gatewayStatus = gatewayStatus;
        this.status = status;
        this.processStatus = processStatus;
        this.processMessage = processMessage;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.qrCode = qrCode;
        this.qrCodeBase64 = qrCodeBase64;
        this.checkoutUrl = checkoutUrl;
        this.paidAt = paidAt;
        this.authorizedAt = authorizedAt;
        this.canceledAt = canceledAt;
        this.failedAt = failedAt;
        this.refundedAt = refundedAt;
        this.expiresAt = expiresAt;
    }
}
exports.FetchMercadoPagoPaymentDtoOut = FetchMercadoPagoPaymentDtoOut;
//# sourceMappingURL=fetch-mercado-pago-payment.dto-out.js.map