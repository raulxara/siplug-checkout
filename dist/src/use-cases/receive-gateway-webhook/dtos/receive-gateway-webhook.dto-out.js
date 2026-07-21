"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveGatewayWebhookDtoOut = void 0;
class ReceiveGatewayWebhookDtoOut {
    eventType;
    processed;
    paymentTransaction;
    checkoutSession;
    constructor(eventType, processed, paymentTransaction, checkoutSession) {
        this.eventType = eventType;
        this.processed = processed;
        this.paymentTransaction = paymentTransaction;
        this.checkoutSession = checkoutSession;
    }
}
exports.ReceiveGatewayWebhookDtoOut = ReceiveGatewayWebhookDtoOut;
//# sourceMappingURL=receive-gateway-webhook.dto-out.js.map