"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitStatusDtoIn = void 0;
class UpdatePaymentSplitStatusDtoIn {
    _id;
    status;
    gatewaySplitId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    source;
    constructor(_id, status, gatewaySplitId, providerPayload, providerResponse, gatewayResponse, metadata, config, source) {
        this._id = _id;
        this.status = status;
        this.gatewaySplitId = gatewaySplitId;
        this.providerPayload = providerPayload;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.metadata = metadata;
        this.config = config;
        this.source = source;
    }
}
exports.UpdatePaymentSplitStatusDtoIn = UpdatePaymentSplitStatusDtoIn;
//# sourceMappingURL=update-payment-split-status.dto-in.js.map