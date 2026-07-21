"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturePayPalOrderReturnDtoOut = void 0;
class CapturePayPalOrderReturnDtoOut {
    paymentWebhookEvent;
    paymentTransaction;
    processingResult;
    providerResponse;
    wasAlreadyRegistered;
    constructor(paymentWebhookEvent, paymentTransaction, processingResult, providerResponse, wasAlreadyRegistered) {
        this.paymentWebhookEvent = paymentWebhookEvent;
        this.paymentTransaction = paymentTransaction;
        this.processingResult = processingResult;
        this.providerResponse = providerResponse;
        this.wasAlreadyRegistered = wasAlreadyRegistered;
    }
}
exports.CapturePayPalOrderReturnDtoOut = CapturePayPalOrderReturnDtoOut;
//# sourceMappingURL=capture-paypal-order-return.dto-out.js.map