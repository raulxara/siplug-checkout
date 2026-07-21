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
exports.PaymentSplitRecipientsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const payment_split_recipient_entity_1 = require("../entities/payment-split-recipient.entity");
let PaymentSplitRecipientsRepository = class PaymentSplitRecipientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            payment_split_id: entity.paymentSplitId,
            split_recipient_id: entity.splitRecipientId,
            gateway_recipient_id: entity.gatewayRecipientId,
            gateway_transfer_id: entity.gatewayTransferId,
            role: entity.role ?? 'secondary',
            amount: entity.amount,
            percentage: entity.percentage === null
                ? null
                : new client_1.Prisma.Decimal(String(entity.percentage)),
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
        const model = await this.prisma.paymentSplitRecipient.create({
            data,
        });
        const fresh = new payment_split_recipient_entity_1.PaymentSplitRecipientEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.paymentSplitId = model.payment_split_id;
        fresh.splitRecipientId = model.split_recipient_id;
        fresh.gatewayRecipientId = model.gateway_recipient_id;
        fresh.gatewayTransferId = model.gateway_transfer_id;
        fresh.role = model.role;
        fresh.amount = model.amount;
        fresh.percentage =
            model.percentage === null ? null : Number(model.percentage.toString());
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
        if (data.gateway_recipient_id !== undefined &&
            data.gateway_recipient_id !== null) {
            updateData.gateway_recipient_id = String(data.gateway_recipient_id);
        }
        if (data.gateway_transfer_id !== undefined &&
            data.gateway_transfer_id !== null) {
            updateData.gateway_transfer_id = String(data.gateway_transfer_id);
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
        const model = await this.prisma.paymentSplitRecipient.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async getAllByPaymentSplitId(paymentSplitId) {
        const rows = await this.prisma.paymentSplitRecipient.findMany({
            where: {
                payment_split_id: paymentSplitId,
            },
            orderBy: {
                id: 'asc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.paymentSplitRecipient.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    toRow(model) {
        return {
            id: model.id,
            _id: model.unique_id,
            paymentSplitId: model.payment_split_id,
            splitRecipientId: model.split_recipient_id,
            gatewayRecipientId: model.gateway_recipient_id,
            gatewayTransferId: model.gateway_transfer_id,
            role: model.role,
            amount: model.amount,
            percentage: model.percentage === null ? null : Number(model.percentage.toString()),
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
exports.PaymentSplitRecipientsRepository = PaymentSplitRecipientsRepository;
exports.PaymentSplitRecipientsRepository = PaymentSplitRecipientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentSplitRecipientsRepository);
//# sourceMappingURL=payment-split-recipients.repository.js.map