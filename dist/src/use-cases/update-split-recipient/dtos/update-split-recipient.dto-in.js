"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSplitRecipientDtoIn = void 0;
class UpdateSplitRecipientDtoIn {
    token;
    splitRecipientId;
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
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.splitRecipientId = String(params.splitRecipientId ?? '').trim();
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.splitRecipientId === '') {
            throw new Error('splitRecipientId is required');
        }
        this.officeId = this.toNullableString(params.officeId);
        this.clientId = this.toNullableString(params.clientId);
        this.gatewayId = this.toNullableString(params.gatewayId);
        this.apiCredentialId = this.toNullableString(params.apiCredentialId);
        this.name = this.toNullableString(params.name);
        this.documentType = this.toNullableString(params.documentType);
        this.documentValue = this.toNullableString(params.documentValue);
        this.email = this.toNullableString(params.email);
        this.gatewayProvider = this.toNullableString(params.gatewayProvider);
        this.gatewayRecipientId = this.toNullableString(params.gatewayRecipientId);
        this.gatewayAccountId = this.toNullableString(params.gatewayAccountId);
        this.bankData = this.toNullableObject(params.bankData);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status);
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.UpdateSplitRecipientDtoIn = UpdateSplitRecipientDtoIn;
//# sourceMappingURL=update-split-recipient.dto-in.js.map