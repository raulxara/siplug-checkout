"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaySplitTransferDtoOut = void 0;
class GatewaySplitTransferDtoOut {
    dispatched;
    gatewayProvider;
    status;
    gatewaySplitId;
    transfers;
    providerRequest;
    providerResponse;
    gatewayResponse;
    errorMessage;
    constructor(dispatched, gatewayProvider, status, gatewaySplitId, transfers, providerRequest, providerResponse, gatewayResponse, errorMessage) {
        this.dispatched = dispatched;
        this.gatewayProvider = gatewayProvider;
        this.status = status;
        this.gatewaySplitId = gatewaySplitId;
        this.transfers = transfers;
        this.providerRequest = providerRequest;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
        this.errorMessage = errorMessage;
    }
}
exports.GatewaySplitTransferDtoOut = GatewaySplitTransferDtoOut;
//# sourceMappingURL=gateway-split-transfer.dto-out.js.map