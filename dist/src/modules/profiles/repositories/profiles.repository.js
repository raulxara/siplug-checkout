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
exports.ProfilesRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const profile_entity_1 = require("../entities/profile.entity");
let ProfilesRepository = class ProfilesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.profile.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                first_name: entity.firstName,
                last_name: entity.lastName,
                email: entity.email,
                phone: entity.phone,
                document_type: entity.documentType,
                document_value: entity.documentValue,
                address_street: entity.addressStreet,
                address_number: entity.addressNumber,
                address_complement: entity.addressComplement,
                address_neighborhood: entity.addressNeighborhood,
                address_city: entity.addressCity,
                address_state: entity.addressState,
                address_country: entity.addressCountry,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status ?? 'active',
            },
        });
        const fresh = new profile_entity_1.ProfileEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.firstName = model.first_name;
        fresh.lastName = model.last_name;
        fresh.email = model.email;
        fresh.phone = model.phone;
        fresh.documentType = model.document_type;
        fresh.documentValue = model.document_value;
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
        if (data.first_name !== undefined && data.first_name !== null) {
            updateData.first_name = String(data.first_name);
        }
        if (data.last_name !== undefined && data.last_name !== null) {
            updateData.last_name = String(data.last_name);
        }
        if (data.email !== undefined && data.email !== null) {
            updateData.email = String(data.email);
        }
        if (data.phone !== undefined && data.phone !== null) {
            updateData.phone = String(data.phone);
        }
        if (data.document_type !== undefined && data.document_type !== null) {
            updateData.document_type = String(data.document_type);
        }
        if (data.document_value !== undefined && data.document_value !== null) {
            updateData.document_value = String(data.document_value);
        }
        if (data.address_street !== undefined && data.address_street !== null) {
            updateData.address_street = String(data.address_street);
        }
        if (data.address_number !== undefined && data.address_number !== null) {
            updateData.address_number = String(data.address_number);
        }
        if (data.address_complement !== undefined &&
            data.address_complement !== null) {
            updateData.address_complement = String(data.address_complement);
        }
        if (data.address_neighborhood !== undefined &&
            data.address_neighborhood !== null) {
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
        const model = await this.prisma.profile.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.profile.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByEmail(email) {
        const model = await this.prisma.profile.findFirst({
            where: {
                email,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByDocument(documentType, documentValue) {
        const model = await this.prisma.profile.findFirst({
            where: {
                document_type: documentType,
                document_value: documentValue,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.profile.findMany({
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
            firstName: model.first_name,
            lastName: model.last_name,
            email: model.email,
            phone: model.phone,
            documentType: model.document_type,
            documentValue: model.document_value,
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
exports.ProfilesRepository = ProfilesRepository;
exports.ProfilesRepository = ProfilesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfilesRepository);
//# sourceMappingURL=profiles.repository.js.map