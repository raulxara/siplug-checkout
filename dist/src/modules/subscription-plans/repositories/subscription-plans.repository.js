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
exports.SubscriptionPlansRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const subscription_plan_entity_1 = require("../entities/subscription-plan.entity");
let SubscriptionPlansRepository = class SubscriptionPlansRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.subscriptionPlan.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                gateway_id: entity.gatewayId,
                api_credential_id: entity.apiCredentialId,
                gateway_plan_id: entity.gatewayPlanId,
                name: entity.name,
                slug: entity.slug,
                description: entity.description,
                amount: entity.amount,
                currency: entity.currency,
                interval_type: entity.billingInterval,
                interval_count: entity.billingIntervalCount,
                trial_days: entity.trialDays,
                max_billing_cycles: entity.maxBillingCycles,
                payment_methods: entity.paymentMethods === null
                    ? client_1.Prisma.JsonNull
                    : entity.paymentMethods,
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
            },
        });
        const fresh = new subscription_plan_entity_1.SubscriptionPlanEntity(this);
        this.hydrateEntityFromModel(fresh, model);
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
        if (data.api_credential_id !== undefined &&
            data.api_credential_id !== null) {
            updateData.api_credential_id = String(data.api_credential_id);
        }
        if (data.gateway_plan_id !== undefined && data.gateway_plan_id !== null) {
            updateData.gateway_plan_id = String(data.gateway_plan_id);
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
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.interval_type !== undefined && data.interval_type !== null) {
            updateData.interval_type = String(data.interval_type);
        }
        if (data.interval_count !== undefined && data.interval_count !== null) {
            updateData.interval_count = Number(data.interval_count);
        }
        if (data.trial_days !== undefined && data.trial_days !== null) {
            updateData.trial_days = Number(data.trial_days);
        }
        if (data.max_billing_cycles !== undefined &&
            data.max_billing_cycles !== null) {
            updateData.max_billing_cycles = Number(data.max_billing_cycles);
        }
        if (data.payment_methods !== undefined &&
            data.payment_methods !== null) {
            updateData.payment_methods =
                data.payment_methods;
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
        const model = await this.prisma.subscriptionPlan.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.subscriptionPlan.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findBySlugAndOfficeId(params) {
        const model = await this.prisma.subscriptionPlan.findFirst({
            where: {
                slug: params.slug,
                office_id: params.officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.subscriptionPlan.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.subscriptionPlan.findMany({
            where: {
                office_id: officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    hydrateEntityFromModel(entity, model) {
        const row = this.toRow(model);
        entity.id = row.id;
        entity._id = row._id;
        entity.officeId = row.officeId;
        entity.clientId = row.clientId;
        entity.gatewayId = row.gatewayId;
        entity.apiCredentialId = row.apiCredentialId;
        entity.gatewayPlanId = row.gatewayPlanId;
        entity.name = row.name;
        entity.slug = row.slug;
        entity.description = row.description;
        entity.billingInterval = row.billingInterval;
        entity.billingIntervalCount = row.billingIntervalCount;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.trialDays = row.trialDays;
        entity.maxBillingCycles = row.maxBillingCycles;
        entity.paymentMethods = row.paymentMethods;
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
            officeId: model.office_id,
            clientId: model.client_id,
            gatewayId: model.gateway_id,
            apiCredentialId: model.api_credential_id,
            gatewayPlanId: model.gateway_plan_id,
            name: model.name,
            slug: model.slug,
            description: model.description,
            billingInterval: model.interval_type,
            billingIntervalCount: model.interval_count,
            amount: model.amount,
            currency: model.currency,
            trialDays: model.trial_days,
            maxBillingCycles: model.max_billing_cycles,
            paymentMethods: this.parseStringArray(model.payment_methods),
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
    parseStringArray(value) {
        if (!Array.isArray(value)) {
            return null;
        }
        return value.map((item) => String(item));
    }
    parseChangesHistory(value) {
        if (!Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.SubscriptionPlansRepository = SubscriptionPlansRepository;
exports.SubscriptionPlansRepository = SubscriptionPlansRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionPlansRepository);
//# sourceMappingURL=subscription-plans.repository.js.map