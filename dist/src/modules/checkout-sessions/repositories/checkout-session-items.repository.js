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
exports.CheckoutSessionItemsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const checkout_session_item_entity_1 = require("../entities/checkout-session-item.entity");
let CheckoutSessionItemsRepository = class CheckoutSessionItemsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.checkoutSessionItem.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                checkout_session_id: entity.checkoutSessionId,
                item_ref: entity.itemRef,
                item_type: entity.itemType,
                name: entity.name,
                description: entity.description,
                quantity: entity.quantity,
                unit_amount: entity.unitAmount,
                total_amount: entity.totalAmount,
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
        const fresh = new checkout_session_item_entity_1.CheckoutSessionItemEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.checkoutSessionId = model.checkout_session_id;
        fresh.itemRef = model.item_ref;
        fresh.itemType = model.item_type;
        fresh.name = model.name;
        fresh.description = model.description;
        fresh.quantity = model.quantity;
        fresh.unitAmount = model.unit_amount;
        fresh.totalAmount = model.total_amount;
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
        if (data.checkout_session_id !== undefined &&
            data.checkout_session_id !== null) {
            updateData.checkout_session_id = String(data.checkout_session_id);
        }
        if (data.item_ref !== undefined && data.item_ref !== null) {
            updateData.item_ref = String(data.item_ref);
        }
        if (data.item_type !== undefined && data.item_type !== null) {
            updateData.item_type = String(data.item_type);
        }
        if (data.name !== undefined && data.name !== null) {
            updateData.name = String(data.name);
        }
        if (data.description !== undefined && data.description !== null) {
            updateData.description = String(data.description);
        }
        if (data.quantity !== undefined && data.quantity !== null) {
            updateData.quantity = Number(data.quantity);
        }
        if (data.unit_amount !== undefined && data.unit_amount !== null) {
            updateData.unit_amount = Number(data.unit_amount);
        }
        if (data.total_amount !== undefined && data.total_amount !== null) {
            updateData.total_amount = Number(data.total_amount);
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
        const model = await this.prisma.checkoutSessionItem.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.checkoutSessionItem.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByCheckoutSessionId(checkoutSessionId) {
        const rows = await this.prisma.checkoutSessionItem.findMany({
            where: {
                checkout_session_id: checkoutSessionId,
            },
            orderBy: {
                id: 'asc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    toRow(model) {
        return {
            id: model.id,
            _id: model.unique_id,
            checkoutSessionId: model.checkout_session_id,
            itemRef: model.item_ref,
            itemType: model.item_type,
            name: model.name,
            description: model.description,
            quantity: model.quantity,
            unitAmount: model.unit_amount,
            totalAmount: model.total_amount,
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
exports.CheckoutSessionItemsRepository = CheckoutSessionItemsRepository;
exports.CheckoutSessionItemsRepository = CheckoutSessionItemsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckoutSessionItemsRepository);
//# sourceMappingURL=checkout-session-items.repository.js.map