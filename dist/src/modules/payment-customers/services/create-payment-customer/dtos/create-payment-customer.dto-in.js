"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentCustomerDtoIn = void 0;
class CreatePaymentCustomerDtoIn {
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
    status;
    constructor(params) {
        this.officeId = params.officeId;
        this.clientId = params.clientId;
        this.profileId = params.profileId ?? null;
        this.externalReference = params.externalReference ?? null;
        this.name = params.name;
        this.email = params.email ?? null;
        this.documentType = params.documentType ?? null;
        this.documentValue = params.documentValue ?? null;
        this.phone = params.phone ?? null;
        this.billingAddress = params.billingAddress ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
    }
}
exports.CreatePaymentCustomerDtoIn = CreatePaymentCustomerDtoIn;
//# sourceMappingURL=create-payment-customer.dto-in.js.map