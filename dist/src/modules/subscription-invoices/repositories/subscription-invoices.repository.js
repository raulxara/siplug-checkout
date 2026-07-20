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
exports.SubscriptionInvoicesRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const subscription_invoice_entity_1 = require("../entities/subscription-invoice.entity");
let SubscriptionInvoicesRepository = class SubscriptionInvoicesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.subscriptionInvoice.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                subscription_id: entity.subscriptionId,
                subscription_cycle_id: entity.subscriptionCycleId,
                payment_transaction_id: entity.paymentTransactionId,
                invoice_number: entity.invoiceNumber,
                amount: entity.amount,
                currency: entity.currency,
                due_at: this.toNullableDate(entity.dueAt),
                paid_at: this.toNullableDate(entity.paidAt),
                attempt_number: entity.attemptNumber,
                external_reference: entity.externalReference,
                gateway_invoice_id: entity.gatewayInvoiceId,
                last_attempt_at: this.toNullableDate(entity.lastAttemptAt),
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
        const fresh = new subscription_invoice_entity_1.SubscriptionInvoiceEntity(this);
        this.hydrateEntityFromModel(fresh, model);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.subscription_id !== undefined && data.subscription_id !== null) {
            updateData.subscription_id = String(data.subscription_id);
        }
        if (data.subscription_cycle_id !== undefined &&
            data.subscription_cycle_id !== null) {
            updateData.subscription_cycle_id = String(data.subscription_cycle_id);
        }
        if (data.payment_transaction_id !== undefined &&
            data.payment_transaction_id !== null) {
            updateData.payment_transaction_id = String(data.payment_transaction_id);
        }
        if (data.invoice_number !== undefined && data.invoice_number !== null) {
            updateData.invoice_number = String(data.invoice_number);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.due_at !== undefined && data.due_at !== null) {
            updateData.due_at = this.toNullableDate(String(data.due_at));
        }
        if (data.paid_at !== undefined && data.paid_at !== null) {
            updateData.paid_at = this.toNullableDate(String(data.paid_at));
        }
        if (data.attempt_number !== undefined && data.attempt_number !== null) {
            updateData.attempt_number = Number(data.attempt_number);
        }
        if (data.external_reference !== undefined &&
            data.external_reference !== null) {
            updateData.external_reference = String(data.external_reference);
        }
        if (data.gateway_invoice_id !== undefined &&
            data.gateway_invoice_id !== null) {
            updateData.gateway_invoice_id = String(data.gateway_invoice_id);
        }
        if (data.last_attempt_at !== undefined && data.last_attempt_at !== null) {
            updateData.last_attempt_at = this.toNullableDate(String(data.last_attempt_at));
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
        const model = await this.prisma.subscriptionInvoice.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByPaymentTransactionId(paymentTransactionId) {
        const model = await this.prisma.subscriptionInvoice.findFirst({
            where: {
                payment_transaction_id: paymentTransactionId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByGatewayInvoiceId(gatewayInvoiceId) {
        const model = await this.prisma.subscriptionInvoice.findFirst({
            where: {
                gateway_invoice_id: gatewayInvoiceId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findLatestBySubscriptionId(subscriptionId) {
        const model = await this.prisma.subscriptionInvoice.findFirst({
            where: {
                subscription_id: subscriptionId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.subscriptionInvoice.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
        return rows;
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.subscriptionInvoice.findMany({
            where: {
                subscription: {
                    office_id: officeId,
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        return rows;
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.subscriptionInvoice.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByInvoiceNumber(invoiceNumber) {
        const model = await this.prisma.subscriptionInvoice.findFirst({
            where: {
                invoice_number: invoiceNumber,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllBySubscriptionId(subscriptionId) {
        const rows = await this.prisma.subscriptionInvoice.findMany({
            where: {
                subscription_id: subscriptionId,
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
        entity.subscriptionId = row.subscriptionId;
        entity.subscriptionCycleId = row.subscriptionCycleId;
        entity.paymentTransactionId = row.paymentTransactionId;
        entity.invoiceNumber = row.invoiceNumber;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.dueAt = row.dueAt;
        entity.paidAt = row.paidAt;
        entity.attemptNumber = row.attemptNumber;
        entity.externalReference = row.externalReference;
        entity.gatewayInvoiceId = row.gatewayInvoiceId;
        entity.lastAttemptAt = row.lastAttemptAt;
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
            subscriptionCycleId: model.subscription_cycle_id,
            paymentTransactionId: model.payment_transaction_id,
            invoiceNumber: model.invoice_number,
            amount: model.amount,
            currency: model.currency,
            dueAt: model.due_at ? (0, format_date_time_util_1.formatDateTime)(model.due_at) : null,
            paidAt: model.paid_at ? (0, format_date_time_util_1.formatDateTime)(model.paid_at) : null,
            attemptNumber: model.attempt_number,
            externalReference: model.external_reference,
            gatewayInvoiceId: model.gateway_invoice_id,
            lastAttemptAt: model.last_attempt_at
                ? (0, format_date_time_util_1.formatDateTime)(model.last_attempt_at)
                : null,
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
exports.SubscriptionInvoicesRepository = SubscriptionInvoicesRepository;
exports.SubscriptionInvoicesRepository = SubscriptionInvoicesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionInvoicesRepository);
//# sourceMappingURL=subscription-invoices.repository.js.map