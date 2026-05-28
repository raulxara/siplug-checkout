"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveGatewayWebhookDtoOut = void 0;
class ReceiveGatewayWebhookDtoOut {
    provider;
    eventType;
    eventAction;
    gatewayTransactionId;
    ignored;
    paymentTransaction;
    checkoutSession;
    constructor(provider, eventType, eventAction, gatewayTransactionId, ignored, paymentTransaction, checkoutSession) {
        this.provider = provider;
        this.eventType = eventType;
        this.eventAction = eventAction;
        this.gatewayTransactionId = gatewayTransactionId;
        this.ignored = ignored;
        this.paymentTransaction = paymentTransaction;
        this.checkoutSession = checkoutSession;
    }
}
exports.ReceiveGatewayWebhookDtoOut = ReceiveGatewayWebhookDtoOut;
//# sourceMappingURL=receive-gateway-webhook.dto-out.js.map