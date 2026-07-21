"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfficeDtoOut = void 0;
class CreateOfficeDtoOut {
    id;
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
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, name, slug, language, currency, addressStreet, addressNumber, addressComplement, addressNeighborhood, addressCity, addressState, addressCountry, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.name = name;
        this.slug = slug;
        this.language = language;
        this.currency = currency;
        this.addressStreet = addressStreet;
        this.addressNumber = addressNumber;
        this.addressComplement = addressComplement;
        this.addressNeighborhood = addressNeighborhood;
        this.addressCity = addressCity;
        this.addressState = addressState;
        this.addressCountry = addressCountry;
        this.config = config;
        this.changesHistory = changesHistory;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(entity) {
        return new CreateOfficeDtoOut(entity.id ?? 0, entity._id ?? '', entity.name, entity.slug, entity.language, entity.currency, entity.addressStreet, entity.addressNumber, entity.addressComplement, entity.addressNeighborhood, entity.addressCity, entity.addressState, entity.addressCountry, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateOfficeDtoOut = CreateOfficeDtoOut;
//# sourceMappingURL=create-office.dto-out.js.map