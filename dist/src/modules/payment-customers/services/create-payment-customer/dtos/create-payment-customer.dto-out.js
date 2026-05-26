"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentCustomerDtoOut = void 0;
class CreatePaymentCustomerDtoOut {
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
    static fromEntity(entity) {
        return new CreatePaymentCustomerDtoOut(entity.id ?? 0, entity._id ?? '', entity.officeId, entity.clientId, entity.profileId, entity.externalReference, entity.name, entity.email, entity.documentType, entity.documentValue, entity.phone, entity.billingAddress, entity.metadata, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreatePaymentCustomerDtoOut = CreatePaymentCustomerDtoOut;
//# sourceMappingURL=create-payment-customer.dto-out.js.map