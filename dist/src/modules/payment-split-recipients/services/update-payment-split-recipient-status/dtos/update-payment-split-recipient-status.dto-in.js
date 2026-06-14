"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitRecipientStatusDtoIn = void 0;
class UpdatePaymentSplitRecipientStatusDtoIn {
    _id;
    status;
    gatewayRecipientId;
    gatewayTransferId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    source;
    constructor(_id, status, gatewayRecipientId, gatewayTransferId, providerPayload, providerResponse, gatewayResponse, metadata, config, source) {
        this._id = _id;
        this.status = status;
        this.gatewayRecipientId = gatewayRecipientId;
        this.gatewayTransferId = gatewayTransferId;
        this.providerPayload = providerPayload;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.metadata = metadata;
        this.config = config;
        this.source = source;
    }
}
exports.UpdatePaymentSplitRecipientStatusDtoIn = UpdatePaymentSplitRecipientStatusDtoIn;
//# sourceMappingURL=update-payment-split-recipient-status.dto-in.js.map