"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class ProfileEntity extends abstract_entity_1.AbstractEntity {
    repository;
    firstName;
    lastName;
    email;
    phone = null;
    documentType = null;
    documentValue = null;
    addressStreet = null;
    addressNumber = null;
    addressComplement = null;
    addressNeighborhood = null;
    addressCity = null;
    addressState = null;
    addressCountry = null;
    config = null;
    changesHistory = null;
    constructor(repository) {
        super();
        this.repository = repository;
    }
    async create() {
        const fresh = await this.repository.create(this);
        this.hydrate({
            id: fresh.id,
            _id: fresh._id,
            firstName: fresh.firstName,
            lastName: fresh.lastName,
            email: fresh.email,
            phone: fresh.phone,
            documentType: fresh.documentType,
            documentValue: fresh.documentValue,
            addressStreet: fresh.addressStreet,
            addressNumber: fresh.addressNumber,
            addressComplement: fresh.addressComplement,
            addressNeighborhood: fresh.addressNeighborhood,
            addressCity: fresh.addressCity,
            addressState: fresh.addressState,
            addressCountry: fresh.addressCountry,
            config: fresh.config,
            changesHistory: fresh.changesHistory,
            status: fresh.status,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
        });
        return this;
    }
}
exports.ProfileEntity = ProfileEntity;
//# sourceMappingURL=profile.entity.js.map