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
exports.ApiCredentialsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const api_credential_entity_1 = require("../entities/api-credential.entity");
let ApiCredentialsRepository = class ApiCredentialsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.apiCredential.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                gateway_id: entity.gatewayId,
                name: entity.name,
                slug: entity.slug,
                provider: entity.provider,
                provider_type: entity.providerType,
                environment: entity.environment,
                token: entity.token,
                origin: entity.origin,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                expires_at: entity.expiresAt === null ? null : new Date(entity.expiresAt),
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status ?? 'active',
            },
        });
        const fresh = new api_credential_entity_1.ApiCredentialEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.gatewayId = model.gateway_id;
        fresh.name = model.name;
        fresh.slug = model.slug;
        fresh.provider = model.provider;
        fresh.providerType = model.provider_type;
        fresh.environment = model.environment;
        fresh.token = model.token;
        fresh.origin = model.origin;
        fresh.config = this.parseJsonObject(model.config);
        fresh.expiresAt = (0, format_date_time_util_1.formatDateTime)(model.expires_at);
        fresh.changesHistory = this.parseChangesHistory(model.changes_history);
        fresh.status = model.status;
        fresh.createdAt = (0, format_date_time_util_1.formatDateTime)(model.created_at);
        fresh.updatedAt = (0, format_date_time_util_1.formatDateTime)(model.updated_at);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.office_id !== undefined && data.office_id !== null) {
            updateData.office_id = String(data.office_id);
        }
        if (data.client_id !== undefined && data.client_id !== null) {
            updateData.client_id = String(data.client_id);
        }
        if (data.gateway_id !== undefined && data.gateway_id !== null) {
            updateData.gateway_id = String(data.gateway_id);
        }
        if (data.name !== undefined && data.name !== null) {
            updateData.name = String(data.name);
        }
        if (data.slug !== undefined && data.slug !== null) {
            updateData.slug = String(data.slug);
        }
        if (data.provider !== undefined && data.provider !== null) {
            updateData.provider = String(data.provider);
        }
        if (data.provider_type !== undefined && data.provider_type !== null) {
            updateData.provider_type = String(data.provider_type);
        }
        if (data.environment !== undefined && data.environment !== null) {
            updateData.environment = String(data.environment);
        }
        if (data.token !== undefined && data.token !== null) {
            updateData.token = String(data.token);
        }
        if (data.origin !== undefined && data.origin !== null) {
            updateData.origin = String(data.origin);
        }
        if (data.config !== undefined && data.config !== null) {
            updateData.config = data.config;
        }
        if (data.expires_at !== undefined && data.expires_at !== null) {
            updateData.expires_at = new Date(String(data.expires_at));
        }
        if (data.changes_history !== undefined && data.changes_history !== null) {
            updateData.changes_history =
                data.changes_history;
        }
        if (data.status !== undefined && data.status !== null) {
            updateData.status = String(data.status);
        }
        const model = await this.prisma.apiCredential.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.apiCredential.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.apiCredential.findMany({
            where: {
                office_id: officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async findBySlug(slug) {
        const model = await this.prisma.apiCredential.findFirst({
            where: {
                slug,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByOfficeIdAndSlug(officeId, slug) {
        const model = await this.prisma.apiCredential.findFirst({
            where: {
                office_id: officeId,
                slug,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.apiCredential.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByClientId(clientId) {
        const rows = await this.prisma.apiCredential.findMany({
            where: {
                client_id: clientId,
            },
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
            officeId: model.office_id,
            clientId: model.client_id,
            gatewayId: model.gateway_id,
            name: model.name,
            slug: model.slug,
            provider: model.provider,
            providerType: model.provider_type,
            environment: model.environment,
            token: model.token,
            origin: model.origin,
            config: this.parseJsonObject(model.config),
            expiresAt: (0, format_date_time_util_1.formatDateTime)(model.expires_at),
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
exports.ApiCredentialsRepository = ApiCredentialsRepository;
exports.ApiCredentialsRepository = ApiCredentialsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiCredentialsRepository);
//# sourceMappingURL=api-credentials.repository.js.map