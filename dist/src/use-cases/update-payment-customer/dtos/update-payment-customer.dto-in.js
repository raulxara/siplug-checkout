"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentCustomerDtoIn = void 0;
class UpdatePaymentCustomerDtoIn {
    token;
    paymentCustomerId;
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
    source;
    constructor(params) {
        this.token = params.token ?? '';
        this.paymentCustomerId = params.paymentCustomerId ?? '';
        this.officeId = params.officeId ?? null;
        this.clientId = params.clientId ?? null;
        this.profileId = params.profileId ?? null;
        this.externalReference = params.externalReference ?? null;
        this.name = params.name ?? null;
        this.email = params.email ?? null;
        this.documentType = params.documentType ?? null;
        this.documentValue = params.documentValue ?? null;
        this.phone = params.phone ?? null;
        this.billingAddress = params.billingAddress ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdatePaymentCustomerUseCase';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.paymentCustomerId.trim() === '') {
            throw new Error('paymentCustomerId is required');
        }
    }
}
exports.UpdatePaymentCustomerDtoIn = UpdatePaymentCustomerDtoIn;
//# sourceMappingURL=update-payment-customer.dto-in.js.map