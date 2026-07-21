"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayRecurringPaymentDtoOut = void 0;
class GatewayRecurringPaymentDtoOut {
    success;
    provider;
    gatewaySubscriptionId;
    gatewayPlanId;
    gatewayInvoiceId;
    gatewayTransactionId;
    gatewayStatus;
    status;
    processStatus;
    processMessage;
    providerRequest;
    providerResponse;
    gatewayResponse;
    checkoutUrl;
    approvalUrl;
    qrCode;
    qrCodeBase64;
    boletoUrl;
    paidAt;
    authorizedAt;
    canceledAt;
    failedAt;
    refundedAt;
    expiresAt;
    constructor(success, provider, gatewaySubscriptionId, gatewayPlanId, gatewayInvoiceId, gatewayTransactionId, gatewayStatus, status, processStatus, processMessage, providerRequest, providerResponse, gatewayResponse, checkoutUrl = null, approvalUrl = null, qrCode = null, qrCodeBase64 = null, boletoUrl = null, paidAt = null, authorizedAt = null, canceledAt = null, failedAt = null, refundedAt = null, expiresAt = null) {
        this.success = success;
        this.provider = provider;
        this.gatewaySubscriptionId = gatewaySubscriptionId;
        this.gatewayPlanId = gatewayPlanId;
        this.gatewayInvoiceId = gatewayInvoiceId;
        this.gatewayTransactionId = gatewayTransactionId;
        this.gatewayStatus = gatewayStatus;
        this.status = status;
        this.processStatus = processStatus;
        this.processMessage = processMessage;
        this.providerRequest = providerRequest;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.checkoutUrl = checkoutUrl;
        this.approvalUrl = approvalUrl;
        this.qrCode = qrCode;
        this.qrCodeBase64 = qrCodeBase64;
        this.boletoUrl = boletoUrl;
        this.paidAt = paidAt;
        this.authorizedAt = authorizedAt;
        this.canceledAt = canceledAt;
        this.failedAt = failedAt;
        this.refundedAt = refundedAt;
        this.expiresAt = expiresAt;
    }
}
exports.GatewayRecurringPaymentDtoOut = GatewayRecurringPaymentDtoOut;
//# sourceMappingURL=gateway-recurring-payment.dto-out.js.map