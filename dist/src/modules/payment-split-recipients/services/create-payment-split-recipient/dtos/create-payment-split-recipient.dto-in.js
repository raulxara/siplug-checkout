"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentSplitRecipientDtoIn = void 0;
class CreatePaymentSplitRecipientDtoIn {
    paymentSplitId;
    splitRecipientId;
    gatewayRecipientId;
    gatewayTransferId;
    role;
    amount;
    percentage;
    currency;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    status;
    constructor(paymentSplitId, splitRecipientId, gatewayRecipientId, gatewayTransferId, role, amount, percentage, currency, providerPayload, providerResponse, gatewayResponse, metadata, config, status) {
        this.paymentSplitId = paymentSplitId;
        this.splitRecipientId = splitRecipientId;
        this.gatewayRecipientId = gatewayRecipientId;
        this.gatewayTransferId = gatewayTransferId;
        this.role = role;
        this.amount = amount;
        this.percentage = percentage;
        this.currency = currency;
        this.providerPayload = providerPayload;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
    }
}
exports.CreatePaymentSplitRecipientDtoIn = CreatePaymentSplitRecipientDtoIn;
//# sourceMappingURL=create-payment-split-recipient.dto-in.js.map