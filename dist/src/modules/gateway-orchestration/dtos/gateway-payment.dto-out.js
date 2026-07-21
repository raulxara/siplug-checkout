"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayPaymentDtoOut = void 0;
class GatewayPaymentDtoOut {
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
    constructor(params) {
        this.success = params.success;
        this.provider = params.provider;
        this.gatewayTransactionId = params.gatewayTransactionId ?? null;
        this.gatewayStatus = params.gatewayStatus ?? null;
        this.status = params.status;
        this.processStatus = params.processStatus;
        this.processMessage = params.processMessage ?? null;
        this.providerRequest = params.providerRequest ?? null;
        this.providerResponse = params.providerResponse ?? null;
        this.gatewayResponse = params.gatewayResponse ?? null;
        this.qrCode = params.qrCode ?? null;
        this.qrCodeBase64 = params.qrCodeBase64 ?? null;
        this.boletoUrl = params.boletoUrl ?? null;
        this.checkoutUrl = params.checkoutUrl ?? null;
        this.paidAt = params.paidAt ?? null;
        this.authorizedAt = params.authorizedAt ?? null;
        this.canceledAt = params.canceledAt ?? null;
        this.failedAt = params.failedAt ?? null;
        this.refundedAt = params.refundedAt ?? null;
        this.expiresAt = params.expiresAt ?? null;
    }
}
exports.GatewayPaymentDtoOut = GatewayPaymentDtoOut;
//# sourceMappingURL=gateway-payment.dto-out.js.map