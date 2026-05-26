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
exports.CheckoutSessionsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const checkout_session_entity_1 = require("../entities/checkout-session.entity");
let CheckoutSessionsRepository = class CheckoutSessionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.checkoutSession.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                payment_customer_id: entity.paymentCustomerId,
                gateway_id: entity.gatewayId,
                api_credential_id: entity.apiCredentialId,
                code: entity.code,
                external_reference: entity.externalReference,
                idempotency_key: entity.idempotencyKey,
                payment_type: entity.paymentType,
                amount: entity.amount,
                currency: entity.currency,
                description: entity.description,
                success_url: entity.successUrl,
                cancel_url: entity.cancelUrl,
                expires_at: entity.expiresAt ? new Date(entity.expiresAt) : null,
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
        const fresh = new checkout_session_entity_1.CheckoutSessionEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.paymentCustomerId = model.payment_customer_id;
        fresh.gatewayId = model.gateway_id;
        fresh.apiCredentialId = model.api_credential_id;
        fresh.code = model.code;
        fresh.externalReference = model.external_reference;
        fresh.idempotencyKey = model.idempotency_key;
        fresh.paymentType = model.payment_type;
        fresh.amount = model.amount;
        fresh.currency = model.currency;
        fresh.description = model.description;
        fresh.successUrl = model.success_url;
        fresh.cancelUrl = model.cancel_url;
        fresh.expiresAt = model.expires_at ? (0, format_date_time_util_1.formatDateTime)(model.expires_at) : null;
        fresh.metadata = this.parseJsonObject(model.metadata);
        fresh.config = this.parseJsonObject(model.config);
        fresh.changesHistory = this.parseChangesHistory(model.changes_history);
        fresh.status = model.status;
        fresh.createdAt = (0, format_date_time_util_1.formatDateTime)(model.created_at);
        fresh.updatedAt = model.updated_at ? (0, format_date_time_util_1.formatDateTime)(model.updated_at) : null;
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
        if (data.code !== undefined && data.code !== null) {
            updateData.code = String(data.code);
        }
        if (data.external_reference !== undefined &&
            data.external_reference !== null) {
            updateData.external_reference = String(data.external_reference);
        }
        if (data.idempotency_key !== undefined &&
            data.idempotency_key !== null) {
            updateData.idempotency_key = String(data.idempotency_key);
        }
        if (data.payment_type !== undefined && data.payment_type !== null) {
            updateData.payment_type = String(data.payment_type);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.description !== undefined && data.description !== null) {
            updateData.description = String(data.description);
        }
        if (data.success_url !== undefined && data.success_url !== null) {
            updateData.success_url = String(data.success_url);
        }
        if (data.cancel_url !== undefined && data.cancel_url !== null) {
            updateData.cancel_url = String(data.cancel_url);
        }
        if (data.expires_at !== undefined && data.expires_at !== null) {
            updateData.expires_at = new Date(String(data.expires_at));
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
        const model = await this.prisma.checkoutSession.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.checkoutSession.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.checkoutSession.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.checkoutSession.findMany({
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
            paymentCustomerId: model.payment_customer_id,
            gatewayId: model.gateway_id,
            apiCredentialId: model.api_credential_id,
            code: model.code,
            externalReference: model.external_reference,
            idempotencyKey: model.idempotency_key,
            paymentType: model.payment_type,
            amount: model.amount,
            currency: model.currency,
            description: model.description,
            successUrl: model.success_url,
            cancelUrl: model.cancel_url,
            expiresAt: model.expires_at ? (0, format_date_time_util_1.formatDateTime)(model.expires_at) : null,
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
};
exports.CheckoutSessionsRepository = CheckoutSessionsRepository;
exports.CheckoutSessionsRepository = CheckoutSessionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckoutSessionsRepository);
//# sourceMappingURL=checkout-sessions.repository.js.map