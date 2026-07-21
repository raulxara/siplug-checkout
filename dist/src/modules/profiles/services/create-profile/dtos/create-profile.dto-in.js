"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfileDtoIn = void 0;
class CreateProfileDtoIn {
    firstName;
    lastName;
    email;
    phone;
    documentType;
    documentValue;
    addressStreet;
    addressNumber;
    addressComplement;
    addressNeighborhood;
    addressCity;
    addressState;
    addressCountry;
    config;
    status;
    constructor(params) {
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.email = params.email;
        this.phone = params.phone ?? null;
        this.documentType = params.documentType ?? null;
        this.documentValue = params.documentValue ?? null;
        this.addressStreet = params.addressStreet ?? null;
        this.addressNumber = params.addressNumber ?? null;
        this.addressComplement = params.addressComplement ?? null;
        this.addressNeighborhood = params.addressNeighborhood ?? null;
        this.addressCity = params.addressCity ?? null;
        this.addressState = params.addressState ?? null;
        this.addressCountry = params.addressCountry ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.firstName.trim() === '') {
            throw new Error('firstName is required');
        }
        if (this.lastName.trim() === '') {
            throw new Error('lastName is required');
        }
        if (this.email.trim() === '') {
            throw new Error('email is required');
        }
    }
}
exports.CreateProfileDtoIn = CreateProfileDtoIn;
//# sourceMappingURL=create-profile.dto-in.js.map