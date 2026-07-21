"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSplitRecipientDtoIn = void 0;
class CreateSplitRecipientDtoIn {
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
    constructor(officeId, clientId, gatewayId, apiCredentialId, name, documentType, documentValue, email, gatewayProvider, gatewayRecipientId, gatewayAccountId, bankData, metadata, config, status) {
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
    }
}
exports.CreateSplitRecipientDtoIn = CreateSplitRecipientDtoIn;
//# sourceMappingURL=create-split-recipient.dto-in.js.map