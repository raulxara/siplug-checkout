"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPaymentCustomerDtoOut = void 0;
class RegisterPaymentCustomerDtoOut {
    id;
    _id;
    officeId;
    clientId;
    profileId;
    externalReference;
    name;
    email;
    documentType;
    documentValue;
    phone;
    billingAddress;
    metadata;
    config;
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, officeId, clientId, profileId, externalReference, name, email, documentType, documentValue, phone, billingAddress, metadata, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.officeId = officeId;
        this.clientId = clientId;
        this.profileId = profileId;
        this.externalReference = externalReference;
        this.name = name;
        this.email = email;
        this.documentType = documentType;
        this.documentValue = documentValue;
        this.phone = phone;
        this.billingAddress = billingAddress;
        this.metadata = metadata;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromCreatePaymentCustomerDtoOut(dtoOut) {
        return new RegisterPaymentCustomerDtoOut(dtoOut.id, dtoOut._id, dtoOut.officeId, dtoOut.clientId, dtoOut.profileId, dtoOut.externalReference, dtoOut.name, dtoOut.email, dtoOut.documentType, dtoOut.documentValue, dtoOut.phone, dtoOut.billingAddress, dtoOut.metadata, dtoOut.config, dtoOut.changesHistory, dtoOut.status, dtoOut.createdAt, dtoOut.updatedAt);
    }
}
exports.RegisterPaymentCustomerDtoOut = RegisterPaymentCustomerDtoOut;
//# sourceMappingURL=register-payment-customer.dto-out.js.map