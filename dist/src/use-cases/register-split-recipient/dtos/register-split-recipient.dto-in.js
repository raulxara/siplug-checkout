"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSplitRecipientDtoIn = void 0;
class RegisterSplitRecipientDtoIn {
    token;
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
        this.officeId = String(params.officeId ?? '').trim();
        this.clientId = String(params.clientId ?? '').trim();
        this.gatewayId = this.toNullableString(params.gatewayId);
        this.apiCredentialId = this.toNullableString(params.apiCredentialId);
        this.name = String(params.name ?? '').trim();
        this.documentType = this.toNullableString(params.documentType);
        this.documentValue = this.toNullableString(params.documentValue);
        this.email = this.toNullableString(params.email);
        this.gatewayProvider = this.toNullableString(params.gatewayProvider);
        this.gatewayRecipientId = this.toNullableString(params.gatewayRecipientId);
        this.gatewayAccountId = this.toNullableString(params.gatewayAccountId);
        this.bankData = this.toNullableObject(params.bankData);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.status = this.toNullableString(params.status) ?? 'active';
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId === '') {
            throw new Error('clientId is required');
        }
        if (this.name === '') {
            throw new Error('name is required');
        }
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
exports.RegisterSplitRecipientDtoIn = RegisterSplitRecipientDtoIn;
//# sourceMappingURL=register-split-recipient.dto-in.js.map