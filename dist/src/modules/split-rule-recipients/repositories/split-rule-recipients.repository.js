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
exports.SplitRuleRecipientsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const split_rule_recipient_entity_1 = require("../entities/split-rule-recipient.entity");
let SplitRuleRecipientsRepository = class SplitRuleRecipientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            split_rule_id: entity.splitRuleId,
            split_recipient_id: entity.splitRecipientId,
            role: entity.role ?? 'secondary',
            percentage: entity.percentage === null
                ? null
                : new client_1.Prisma.Decimal(String(entity.percentage)),
            fixed_amount: entity.fixedAmount,
            liable_for_gateway_fee: entity.liableForGatewayFee ?? false,
            liable_for_refund: entity.liableForRefund ?? false,
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
        const model = await this.prisma.splitRuleRecipient.create({
            data,
        });
        const fresh = new split_rule_recipient_entity_1.SplitRuleRecipientEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.splitRuleId = model.split_rule_id;
        fresh.splitRecipientId = model.split_recipient_id;
        fresh.role = model.role;
        fresh.percentage =
            model.percentage === null ? null : Number(model.percentage.toString());
        fresh.fixedAmount = model.fixed_amount;
        fresh.liableForGatewayFee = model.liable_for_gateway_fee;
        fresh.liableForRefund = model.liable_for_refund;
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
        if (data.split_rule_id !== undefined && data.split_rule_id !== null) {
            updateData.split_rule_id = String(data.split_rule_id);
        }
        if (data.split_recipient_id !== undefined &&
            data.split_recipient_id !== null) {
            updateData.split_recipient_id = String(data.split_recipient_id);
        }
        if (data.role !== undefined && data.role !== null) {
            updateData.role = String(data.role);
        }
        if (data.percentage !== undefined && data.percentage !== null) {
            updateData.percentage = new client_1.Prisma.Decimal(String(data.percentage));
        }
        if (data.fixed_amount !== undefined && data.fixed_amount !== null) {
            updateData.fixed_amount = Number(data.fixed_amount);
        }
        if (data.liable_for_gateway_fee !== undefined &&
            data.liable_for_gateway_fee !== null) {
            updateData.liable_for_gateway_fee = Boolean(data.liable_for_gateway_fee);
        }
        if (data.liable_for_refund !== undefined &&
            data.liable_for_refund !== null) {
            updateData.liable_for_refund = Boolean(data.liable_for_refund);
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
        const model = await this.prisma.splitRuleRecipient.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.splitRuleRecipient.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByRuleIdAndRecipientId(splitRuleId, splitRecipientId) {
        const model = await this.prisma.splitRuleRecipient.findFirst({
            where: {
                split_rule_id: splitRuleId,
                split_recipient_id: splitRecipientId,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllBySplitRuleId(splitRuleId) {
        const rows = await this.prisma.splitRuleRecipient.findMany({
            where: {
                split_rule_id: splitRuleId,
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
            splitRuleId: model.split_rule_id,
            splitRecipientId: model.split_recipient_id,
            role: model.role,
            percentage: model.percentage === null ? null : Number(model.percentage.toString()),
            fixedAmount: model.fixed_amount,
            liableForGatewayFee: model.liable_for_gateway_fee,
            liableForRefund: model.liable_for_refund,
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
exports.SplitRuleRecipientsRepository = SplitRuleRecipientsRepository;
exports.SplitRuleRecipientsRepository = SplitRuleRecipientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SplitRuleRecipientsRepository);
//# sourceMappingURL=split-rule-recipients.repository.js.map