"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeEntity = void 0;
const abstract_entity_1 = require("../../../shared/entities/abstract.entity");
class OfficeEntity extends abstract_entity_1.AbstractEntity {
    repository;
    name;
    slug;
    language = null;
    currency = null;
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
            name: fresh.name,
            slug: fresh.slug,
            language: fresh.language,
            currency: fresh.currency,
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
exports.OfficeEntity = OfficeEntity;
//# sourceMappingURL=office.entity.js.map