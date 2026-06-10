"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentSplitDtoIn = void 0;
class CreatePaymentSplitDtoIn {
    officeId;
    clientId;
    checkoutSessionId;
    paymentTransactionId;
    subscriptionId;
    subscriptionInvoiceId;
    splitRuleId;
    gatewayProvider;
    gatewaySplitId;
    amount;
    currency;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    status;
    constructor(officeId, clientId, checkoutSessionId, paymentTransactionId, subscriptionId, subscriptionInvoiceId, splitRuleId, gatewayProvider, gatewaySplitId, amount, currency, providerPayload, providerResponse, gatewayResponse, metadata, config, status) {
        this.officeId = officeId;
        this.clientId = clientId;
        this.checkoutSessionId = checkoutSessionId;
        this.paymentTransactionId = paymentTransactionId;
        this.subscriptionId = subscriptionId;
        this.subscriptionInvoiceId = subscriptionInvoiceId;
        this.splitRuleId = splitRuleId;
        this.gatewayProvider = gatewayProvider;
        this.gatewaySplitId = gatewaySplitId;
        this.amount = amount;
        this.currency = currency;
        this.providerPayload = providerPayload;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreatePaymentSplitDtoIn = CreatePaymentSplitDtoIn;
//# sourceMappingURL=create-payment-split.dto-in.js.map