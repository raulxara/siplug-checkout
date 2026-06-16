"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMercadoPagoWebhookDtoOut = void 0;
class ReceiveMercadoPagoWebhookDtoOut {
    paymentWebhookEvent;
    paymentTransaction;
    processingResult;
    wasAlreadyRegistered;
    constructor(paymentWebhookEvent, paymentTransaction, processingResult, wasAlreadyRegistered) {
        this.paymentWebhookEvent = paymentWebhookEvent;
        this.paymentTransaction = paymentTransaction;
        this.processingResult = processingResult;
        this.wasAlreadyRegistered = wasAlreadyRegistered;
    }
}
exports.ReceiveMercadoPagoWebhookDtoOut = ReceiveMercadoPagoWebhookDtoOut;
//# sourceMappingURL=receive-mercado-pago-webhook.dto-out.js.map