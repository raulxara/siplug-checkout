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
exports.PaymentSplitsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const payment_split_entity_1 = require("../entities/payment-split.entity");
let PaymentSplitsRepository = class PaymentSplitsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            office_id: entity.officeId,
            client_id: entity.clientId,
            checkout_session_id: entity.checkoutSessionId,
            payment_transaction_id: entity.paymentTransactionId,
            subscription_id: entity.subscriptionId,
            subscription_invoice_id: entity.subscriptionInvoiceId,
            split_rule_id: entity.splitRuleId,
            gateway_provider: entity.gatewayProvider,
            gateway_split_id: entity.gatewaySplitId,
            amount: entity.amount,
            currency: entity.currency,
            provider_payload: entity.providerPayload === null
                ? client_1.Prisma.JsonNull
                : entity.providerPayload,
            provider_response: entity.providerResponse === null
                ? client_1.Prisma.JsonNull
                : entity.providerResponse,
            gateway_response: entity.gatewayResponse === null
                ? client_1.Prisma.JsonNull
                : entity.gatewayResponse,
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
        };
        const model = await this.prisma.paymentSplit.create({
            data,
        });
        const fresh = new payment_split_entity_1.PaymentSplitEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.checkoutSessionId = model.checkout_session_id;
        fresh.paymentTransactionId = model.payment_transaction_id;
        fresh.subscriptionId = model.subscription_id;
        fresh.subscriptionInvoiceId = model.subscription_invoice_id;
        fresh.splitRuleId = model.split_rule_id;
        fresh.gatewayProvider = model.gateway_provider;
        fresh.gatewaySplitId = model.gateway_split_id;
        fresh.amount = model.amount;
        fresh.currency = model.currency;
        fresh.providerPayload = this.parseJsonObject(model.provider_payload);
        fresh.providerResponse = this.parseJsonObject(model.provider_response);
        fresh.gatewayResponse = this.parseJsonObject(model.gateway_response);
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
        if (data.gateway_split_id !== undefined && data.gateway_split_id !== null) {
            updateData.gateway_split_id = String(data.gateway_split_id);
        }
        if (data.provider_payload !== undefined && data.provider_payload !== null) {
            updateData.provider_payload =
                data.provider_payload;
        }
        if (data.provider_response !== undefined &&
            data.provider_response !== null) {
            updateData.provider_response =
                data.provider_response;
        }
        if (data.gateway_response !== undefined && data.gateway_response !== null) {
            updateData.gateway_response =
                data.gateway_response;
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
        const model = await this.prisma.paymentSplit.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.paymentSplit.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByPaymentTransactionId(paymentTransactionId) {
        const rows = await this.prisma.paymentSplit.findMany({
            where: {
                payment_transaction_id: paymentTransactionId,
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
            checkoutSessionId: model.checkout_session_id,
            paymentTransactionId: model.payment_transaction_id,
            subscriptionId: model.subscription_id,
            subscriptionInvoiceId: model.subscription_invoice_id,
            splitRuleId: model.split_rule_id,
            gatewayProvider: model.gateway_provider,
            gatewaySplitId: model.gateway_split_id,
            amount: model.amount,
            currency: model.currency,
            providerPayload: this.parseJsonObject(model.provider_payload),
            providerResponse: this.parseJsonObject(model.provider_response),
            gatewayResponse: this.parseJsonObject(model.gateway_response),
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
exports.PaymentSplitsRepository = PaymentSplitsRepository;
exports.PaymentSplitsRepository = PaymentSplitsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentSplitsRepository);
//# sourceMappingURL=payment-splits.repository.js.map