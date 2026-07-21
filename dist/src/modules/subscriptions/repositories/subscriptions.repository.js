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
exports.SubscriptionsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const subscription_entity_1 = require("../entities/subscription.entity");
let SubscriptionsRepository = class SubscriptionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.subscription.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                subscription_plan_id: entity.subscriptionPlanId,
                payment_customer_id: entity.paymentCustomerId,
                gateway_id: entity.gatewayId,
                api_credential_id: entity.apiCredentialId,
                gateway_subscription_id: entity.gatewaySubscriptionId,
                external_reference: entity.externalReference,
                amount: entity.amount,
                currency: entity.currency,
                current_cycle: entity.currentCycle,
                next_billing_at: this.toNullableDate(entity.nextBillingAt),
                started_at: this.toNullableDate(entity.startedAt),
                canceled_at: this.toNullableDate(entity.canceledAt),
                ended_at: this.toNullableDate(entity.endedAt),
                metadata: entity.metadata === null
                    ? client_1.Prisma.JsonNull
                    : entity.metadata,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status ?? 'created',
            },
        });
        const fresh = new subscription_entity_1.SubscriptionEntity(this);
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
        if (data.subscription_plan_id !== undefined &&
            data.subscription_plan_id !== null) {
            updateData.subscription_plan_id = String(data.subscription_plan_id);
        }
        if (data.payment_customer_id !== undefined &&
            data.payment_customer_id !== null) {
            updateData.payment_customer_id = String(data.payment_customer_id);
        }
        if (data.gateway_id !== undefined && data.gateway_id !== null) {
            updateData.gateway_id = String(data.gateway_id);
        }
        if (data.api_credential_id !== undefined &&
            data.api_credential_id !== null) {
            updateData.api_credential_id = String(data.api_credential_id);
        }
        if (data.gateway_subscription_id !== undefined &&
            data.gateway_subscription_id !== null) {
            updateData.gateway_subscription_id = String(data.gateway_subscription_id);
        }
        if (data.external_reference !== undefined &&
            data.external_reference !== null) {
            updateData.external_reference = String(data.external_reference);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.current_cycle !== undefined && data.current_cycle !== null) {
            updateData.current_cycle = Number(data.current_cycle);
        }
        if (data.next_billing_at !== undefined &&
            data.next_billing_at !== null) {
            updateData.next_billing_at = this.toNullableDate(String(data.next_billing_at));
        }
        if (data.started_at !== undefined && data.started_at !== null) {
            updateData.started_at = this.toNullableDate(String(data.started_at));
        }
        if (data.canceled_at !== undefined && data.canceled_at !== null) {
            updateData.canceled_at = this.toNullableDate(String(data.canceled_at));
        }
        if (data.ended_at !== undefined && data.ended_at !== null) {
            updateData.ended_at = this.toNullableDate(String(data.ended_at));
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
        const model = await this.prisma.subscription.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.subscription.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByExternalReferenceAndOfficeId(params) {
        const model = await this.prisma.subscription.findFirst({
            where: {
                external_reference: params.externalReference,
                office_id: params.officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.subscription.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.subscription.findMany({
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
        entity.subscriptionPlanId = row.subscriptionPlanId;
        entity.paymentCustomerId = row.paymentCustomerId;
        entity.gatewayId = row.gatewayId;
        entity.apiCredentialId = row.apiCredentialId;
        entity.gatewaySubscriptionId = row.gatewaySubscriptionId;
        entity.externalReference = row.externalReference;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.currentCycle = row.currentCycle;
        entity.nextBillingAt = row.nextBillingAt;
        entity.startedAt = row.startedAt;
        entity.canceledAt = row.canceledAt;
        entity.endedAt = row.endedAt;
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
            subscriptionPlanId: model.subscription_plan_id,
            paymentCustomerId: model.payment_customer_id,
            gatewayId: model.gateway_id,
            apiCredentialId: model.api_credential_id,
            gatewaySubscriptionId: model.gateway_subscription_id,
            externalReference: model.external_reference,
            amount: model.amount,
            currency: model.currency,
            currentCycle: model.current_cycle,
            nextBillingAt: model.next_billing_at
                ? (0, format_date_time_util_1.formatDateTime)(model.next_billing_at)
                : null,
            startedAt: model.started_at ? (0, format_date_time_util_1.formatDateTime)(model.started_at) : null,
            canceledAt: model.canceled_at ? (0, format_date_time_util_1.formatDateTime)(model.canceled_at) : null,
            endedAt: model.ended_at ? (0, format_date_time_util_1.formatDateTime)(model.ended_at) : null,
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
exports.SubscriptionsRepository = SubscriptionsRepository;
exports.SubscriptionsRepository = SubscriptionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsRepository);
//# sourceMappingURL=subscriptions.repository.js.map