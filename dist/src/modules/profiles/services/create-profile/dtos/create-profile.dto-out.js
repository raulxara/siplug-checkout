"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfileDtoOut = void 0;
class CreateProfileDtoOut {
    id;
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
    changesHistory;
    status;
    createdAt;
    updatedAt;
    constructor(id, _id, firstName, lastName, email, phone, documentType, documentValue, addressStreet, addressNumber, addressComplement, addressNeighborhood, addressCity, addressState, addressCountry, config, changesHistory, status, createdAt, updatedAt) {
        this.id = id;
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.documentType = documentType;
        this.documentValue = documentValue;
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
        return new CreateProfileDtoOut(entity.id ?? 0, entity._id ?? '', entity.firstName, entity.lastName, entity.email, entity.phone, entity.documentType, entity.documentValue, entity.addressStreet, entity.addressNumber, entity.addressComplement, entity.addressNeighborhood, entity.addressCity, entity.addressState, entity.addressCountry, entity.config, entity.changesHistory, entity.status ?? 'active', entity.createdAt, entity.updatedAt);
    }
}
exports.CreateProfileDtoOut = CreateProfileDtoOut;
//# sourceMappingURL=create-profile.dto-out.js.map