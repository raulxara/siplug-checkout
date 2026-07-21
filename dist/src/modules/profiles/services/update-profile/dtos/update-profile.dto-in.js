"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileDtoIn = void 0;
class UpdateProfileDtoIn {
    _id;
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
    source;
    constructor(params) {
        this._id = params._id;
        this.firstName = params.firstName ?? null;
        this.lastName = params.lastName ?? null;
        this.email = params.email ?? null;
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
        this.status = params.status ?? null;
        this.source = params.source ?? 'system';
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.UpdateProfileDtoIn = UpdateProfileDtoIn;
//# sourceMappingURL=update-profile.dto-in.js.map