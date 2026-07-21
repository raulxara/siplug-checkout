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
exports.SplitRulesRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const split_rule_entity_1 = require("../entities/split-rule.entity");
let SplitRulesRepository = class SplitRulesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            office_id: entity.officeId,
            client_id: entity.clientId,
            gateway_id: entity.gatewayId,
            name: entity.name,
            slug: entity.slug,
            description: entity.description,
            split_type: entity.splitType,
            calculation_base: entity.calculationBase ?? 'gross_amount',
            priority: entity.priority ?? 0,
            metadata: entity.metadata === null
                ? client_1.Prisma.JsonNull
                : entity.metadata,
            config: entity.config === null
                ? client_1.Prisma.JsonNull
                : entity.config,
            changes_history: entity.changesHistory === null
                ? client_1.Prisma.JsonNull
                : entity.changesHistory,
            status: entity.status ?? 'active',
        };
        const model = await this.prisma.splitRule.create({
            data,
        });
        const fresh = new split_rule_entity_1.SplitRuleEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.gatewayId = model.gateway_id;
        fresh.name = model.name;
        fresh.slug = model.slug;
        fresh.description = model.description;
        fresh.splitType = model.split_type;
        fresh.calculationBase = model.calculation_base;
        fresh.priority = model.priority;
        fresh.metadata = this.parseJsonObject(model.metadata);
        fresh.config = this.parseJsonObject(model.config);
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
        if (data.description !== undefined && data.description !== null) {
            updateData.description = String(data.description);
        }
        if (data.split_type !== undefined && data.split_type !== null) {
            updateData.split_type = String(data.split_type);
        }
        if (data.calculation_base !== undefined &&
            data.calculation_base !== null) {
            updateData.calculation_base = String(data.calculation_base);
        }
        if (data.priority !== undefined && data.priority !== null) {
            updateData.priority = Number(data.priority);
        }
        if (data.metadata !== undefined && data.metadata !== null) {
            updateData.metadata = data.metadata;
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
        const model = await this.prisma.splitRule.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.splitRule.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByOfficeIdAndSlug(officeId, slug) {
        const model = await this.prisma.splitRule.findFirst({
            where: {
                office_id: officeId,
                slug,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.splitRule.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.splitRule.findMany({
            where: {
                office_id: officeId,
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
            description: model.description,
            splitType: model.split_type,
            calculationBase: model.calculation_base,
            priority: model.priority,
            metadata: this.parseJsonObject(model.metadata),
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
exports.SplitRulesRepository = SplitRulesRepository;
exports.SplitRulesRepository = SplitRulesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SplitRulesRepository);
//# sourceMappingURL=split-rules.repository.js.map