"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfficeDtoIn = void 0;
class CreateOfficeDtoIn {
    name;
    slug;
    language;
    currency;
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
        this.name = params.name;
        this.slug = params.slug;
        this.language = params.language ?? null;
        this.currency = params.currency ?? 'BRL';
        this.addressStreet = params.addressStreet ?? null;
        this.addressNumber = params.addressNumber ?? null;
        this.addressComplement = params.addressComplement ?? null;
        this.addressNeighborhood = params.addressNeighborhood ?? null;
        this.addressCity = params.addressCity ?? null;
        this.addressState = params.addressState ?? null;
        this.addressCountry = params.addressCountry ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.CreateOfficeDtoIn = CreateOfficeDtoIn;
//# sourceMappingURL=create-office.dto-in.js.map