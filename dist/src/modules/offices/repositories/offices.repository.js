"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficesRepository = void 0;
const common_1 = require("@nestjs/common");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const office_entity_1 = require("../entities/office.entity");
let OfficesRepository = class OfficesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.office.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                name: entity.name,
                slug: entity.slug,
                language: entity.language,
                currency: entity.currency,
                address_street: entity.addressStreet,
                address_number: entity.addressNumber,
                address_complement: entity.addressComplement,
                address_neighborhood: entity.addressNeighborhood,
                address_city: entity.addressCity,
                address_state: entity.addressState,
                address_country: entity.addressCountry,
                config: entity.config,
                changes_history: entity.changesHistory,
                status: entity.status ?? 'active',
            },
        });
        const fresh = new office_entity_1.OfficeEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.name = model.name;
        fresh.slug = model.slug;
        fresh.language = model.language;
        fresh.currency = model.currency;
        fresh.addressStreet = model.address_street;
        fresh.addressNumber = model.address_number;
        fresh.addressComplement = model.address_complement;
        fresh.addressNeighborhood = model.address_neighborhood;
        fresh.addressCity = model.address_city;
        fresh.addressState = model.address_state;
        fresh.addressCountry = model.address_country;
        fresh.config = this.parseJsonObject(model.config);
        fresh.changesHistory = this.parseChangesHistory(model.changes_history);
        fresh.status = model.status;
        fresh.createdAt = (0, format_date_time_util_1.formatDateTime)(model.created_at);
        fresh.updatedAt = (0, format_date_time_util_1.formatDateTime)(model.updated_at);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.name !== undefined && data.name !== null) {
            updateData.name = String(data.name);
        }
        if (data.slug !== undefined && data.slug !== null) {
            updateData.slug = String(data.slug);
        }
        if (data.language !== undefined && data.language !== null) {
            updateData.language = String(data.language);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.address_street !== undefined && data.address_street !== null) {
            updateData.address_street = String(data.address_street);
        }
        if (data.address_number !== undefined && data.address_number !== null) {
            updateData.address_number = String(data.address_number);
        }
        if (data.address_complement !== undefined && data.address_complement !== null) {
            updateData.address_complement = String(data.address_complement);
        }
        if (data.address_neighborhood !== undefined && data.address_neighborhood !== null) {
            updateData.address_neighborhood = String(data.address_neighborhood);
        }
        if (data.address_city !== undefined && data.address_city !== null) {
            updateData.address_city = String(data.address_city);
        }
        if (data.address_state !== undefined && data.address_state !== null) {
            updateData.address_state = String(data.address_state);
        }
        if (data.address_country !== undefined && data.address_country !== null) {
            updateData.address_country = String(data.address_country);
        }
        if (data.config !== undefined && data.config !== null) {
            updateData.config = data.config;
        }
        if (data.changes_history !== undefined && data.changes_history !== null) {
            updateData.changes_history =
                data.changes_history;
        }
        if (data.status !== undefined && data.status !== null) {
            updateData.status = String(data.status);
        }
        const model = await this.prisma.office.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.office.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findBySlug(slug) {
        const model = await this.prisma.office.findFirst({
            where: {
                slug,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.office.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    toRow(model) {
        return {
            id: model.id,
            _id: model.unique_id,
            name: model.name,
            slug: model.slug,
            language: model.language,
            currency: model.currency,
            addressStreet: model.address_street,
            addressNumber: model.address_number,
            addressComplement: model.address_complement,
            addressNeighborhood: model.address_neighborhood,
            addressCity: model.address_city,
            addressState: model.address_state,
            addressCountry: model.address_country,
            config: this.parseJsonObject(model.config),
            changesHistory: this.parseChangesHistory(model.changes_history),
            status: model.status,
            createdAt: (0, format_date_time_util_1.formatDateTime)(model.created_at),
            updatedAt: (0, format_date_time_util_1.formatDateTime)(model.updated_at),
        };
    }
    parseJsonObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    parseChangesHistory(value) {
        if (!Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.OfficesRepository = OfficesRepository;
exports.OfficesRepository = OfficesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OfficesRepository);
//# sourceMappingURL=offices.repository.js.map