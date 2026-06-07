"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRecipientDtoIn = void 0;
class UpdateSplitRecipientDtoIn {
    _id;
    officeId;
    clientId;
    gatewayId;
    apiCredentialId;
    name;
    documentType;
    documentValue;
    email;
    gatewayProvider;
    gatewayRecipientId;
    gatewayAccountId;
    bankData;
    metadata;
    config;
    status;
    source;
    constructor(_id, officeId, clientId, gatewayId, apiCredentialId, name, documentType, documentValue, email, gatewayProvider, gatewayRecipientId, gatewayAccountId, bankData, metadata, config, status, source) {
        this._id = _id;
        this.officeId = officeId;
        this.clientId = clientId;
        this.gatewayId = gatewayId;
        this.apiCredentialId = apiCredentialId;
        this.name = name;
        this.documentType = documentType;
        this.documentValue = documentValue;
        this.email = email;
        this.gatewayProvider = gatewayProvider;
        this.gatewayRecipientId = gatewayRecipientId;
        this.gatewayAccountId = gatewayAccountId;
        this.bankData = bankData;
        this.metadata = metadata;
        this.config = config;
        this.status = status;
        this.source = source;
    }
}
exports.UpdateSplitRecipientDtoIn = UpdateSplitRecipientDtoIn;
//# sourceMappingURL=update-split-recipient.dto-in.js.map