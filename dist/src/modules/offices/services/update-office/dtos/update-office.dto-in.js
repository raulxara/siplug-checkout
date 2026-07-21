"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOfficeDtoIn = void 0;
class UpdateOfficeDtoIn {
    _id;
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
    source;
    constructor(params) {
        this._id = params._id;
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.language = params.language ?? null;
        this.currency = params.currency ?? null;
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
exports.UpdateOfficeDtoIn = UpdateOfficeDtoIn;
//# sourceMappingURL=update-office.dto-in.js.map