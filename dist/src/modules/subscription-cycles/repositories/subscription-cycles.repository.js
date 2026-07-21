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
exports.SubscriptionCyclesRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const subscription_cycle_entity_1 = require("../entities/subscription-cycle.entity");
let SubscriptionCyclesRepository = class SubscriptionCyclesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.subscriptionCycle.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                subscription_id: entity.subscriptionId,
                cycle_number: entity.cycleNumber,
                amount: entity.amount,
                currency: entity.currency,
                period_start: this.toNullableDate(entity.periodStart),
                period_end: this.toNullableDate(entity.periodEnd),
                scheduled_at: this.toNullableDate(entity.scheduledAt),
                processed_at: this.toNullableDate(entity.processedAt),
                metadata: entity.metadata === null
                    ? client_1.Prisma.JsonNull
                    : entity.metadata,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status ?? 'scheduled',
            },
        });
        const fresh = new subscription_cycle_entity_1.SubscriptionCycleEntity(this);
        this.hydrateEntityFromModel(fresh, model);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.subscription_id !== undefined && data.subscription_id !== null) {
            updateData.subscription_id = String(data.subscription_id);
        }
        if (data.cycle_number !== undefined && data.cycle_number !== null) {
            updateData.cycle_number = Number(data.cycle_number);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.period_start !== undefined && data.period_start !== null) {
            updateData.period_start = this.toNullableDate(String(data.period_start));
        }
        if (data.period_end !== undefined && data.period_end !== null) {
            updateData.period_end = this.toNullableDate(String(data.period_end));
        }
        if (data.scheduled_at !== undefined && data.scheduled_at !== null) {
            updateData.scheduled_at = this.toNullableDate(String(data.scheduled_at));
        }
        if (data.processed_at !== undefined && data.processed_at !== null) {
            updateData.processed_at = this.toNullableDate(String(data.processed_at));
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
        const model = await this.prisma.subscriptionCycle.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.subscriptionCycle.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findBySubscriptionIdAndCycleNumber(params) {
        const model = await this.prisma.subscriptionCycle.findFirst({
            where: {
                subscription_id: params.subscriptionId,
                cycle_number: params.cycleNumber,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllBySubscriptionId(subscriptionId) {
        const rows = await this.prisma.subscriptionCycle.findMany({
            where: {
                subscription_id: subscriptionId,
            },
            orderBy: {
                cycle_number: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    hydrateEntityFromModel(entity, model) {
        const row = this.toRow(model);
        entity.id = row.id;
        entity._id = row._id;
        entity.subscriptionId = row.subscriptionId;
        entity.cycleNumber = row.cycleNumber;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.periodStart = row.periodStart;
        entity.periodEnd = row.periodEnd;
        entity.scheduledAt = row.scheduledAt;
        entity.processedAt = row.processedAt;
        entity.metadata = row.metadata;
        entity.config = row.config;
        entity.changesHistory = row.changesHistory;
        entity.status = row.status;
        entity.createdAt = row.createdAt;
        entity.updatedAt = row.updatedAt;
    }
    toRow(model) {
        return {
            id: model.id,
            _id: model.unique_id,
            subscriptionId: model.subscription_id,
            cycleNumber: model.cycle_number,
            amount: model.amount,
            currency: model.currency,
            periodStart: model.period_start ? (0, format_date_time_util_1.formatDateTime)(model.period_start) : null,
            periodEnd: model.period_end ? (0, format_date_time_util_1.formatDateTime)(model.period_end) : null,
            scheduledAt: model.scheduled_at ? (0, format_date_time_util_1.formatDateTime)(model.scheduled_at) : null,
            processedAt: model.processed_at ? (0, format_date_time_util_1.formatDateTime)(model.processed_at) : null,
            metadata: this.parseJsonObject(model.metadata),
            config: this.parseJsonObject(model.config),
            changesHistory: this.parseChangesHistory(model.changes_history),
            status: model.status,
            createdAt: (0, format_date_time_util_1.formatDateTime)(model.created_at),
            updatedAt: model.updated_at ? (0, format_date_time_util_1.formatDateTime)(model.updated_at) : null,
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
    toNullableDate(value) {
        if (value === null || value.trim() === '') {
            return null;
        }
        return new Date(value);
    }
};
exports.SubscriptionCyclesRepository = SubscriptionCyclesRepository;
exports.SubscriptionCyclesRepository = SubscriptionCyclesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionCyclesRepository);
//# sourceMappingURL=subscription-cycles.repository.js.map