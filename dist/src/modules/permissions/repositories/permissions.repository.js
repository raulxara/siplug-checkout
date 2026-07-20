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
exports.PermissionsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const permission_entity_1 = require("../entities/permission.entity");
let PermissionsRepository = class PermissionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            office_id: entity.officeId,
            name: entity.name,
            slug: entity.slug,
            description: entity.description,
            entity: entity.entity,
            action: entity.action,
            config: entity.config === null
                ? client_1.Prisma.JsonNull
                : entity.config,
            changes_history: entity.changesHistory === null
                ? client_1.Prisma.JsonNull
                : entity.changesHistory,
            status: entity.status ?? 'active',
        };
        const model = await this.prisma.permission.create({
            data,
        });
        const fresh = new permission_entity_1.PermissionEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.name = model.name;
        fresh.slug = model.slug;
        fresh.description = model.description;
        fresh.entity = model.entity;
        fresh.action = model.action;
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
        if (data.description !== undefined && data.description !== null) {
            updateData.description = String(data.description);
        }
        if (data.config !== undefined && data.config !== null) {
            updateData.config = data.config;
        }
        const changesHistory = data.changes_history ?? data.changesHistory;
        if (changesHistory !== undefined && changesHistory !== null) {
            updateData.changes_history = changesHistory;
        }
        if (data.status !== undefined && data.status !== null) {
            updateData.status = String(data.status);
        }
        const model = await this.prisma.permission.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.permission.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.permission.findMany({
            where: {
                office_id: officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async findBySlug(officeId, slug) {
        const model = await this.prisma.permission.findFirst({
            where: {
                office_id: officeId,
                slug,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.permission.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByUniqueIds(_ids) {
        const rows = await this.prisma.permission.findMany({
            where: {
                unique_id: {
                    in: _ids,
                },
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
            name: model.name,
            slug: model.slug,
            description: model.description,
            entity: model.entity,
            action: model.action,
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
exports.PermissionsRepository = PermissionsRepository;
exports.PermissionsRepository = PermissionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsRepository);
//# sourceMappingURL=permissions.repository.js.map