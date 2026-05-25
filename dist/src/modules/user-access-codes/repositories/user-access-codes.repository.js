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
exports.UserAccessCodesRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const user_access_code_entity_1 = require("../entities/user-access-code.entity");
let UserAccessCodesRepository = class UserAccessCodesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const expiresAt = entity.expiresAt === null
            ? new Date(Date.now() + 15 * 60 * 1000)
            : new Date(entity.expiresAt);
        const model = await this.prisma.userAccessCode.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                user_id: entity.userCustomerId,
                type: entity.channel,
                sent_to: entity.destination,
                code: entity.code,
                expires_at: expiresAt,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status ?? 'created',
            },
        });
        const fresh = new user_access_code_entity_1.UserAccessCodeEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.userCustomerId = model.user_id;
        fresh.channel = model.type;
        fresh.destination = model.sent_to;
        fresh.code = model.code;
        fresh.expiresAt = (0, format_date_time_util_1.formatDateTime)(model.expires_at);
        fresh.usedAt = null;
        fresh.sentAt = null;
        fresh.config = this.parseJsonObject(model.config);
        fresh.changesHistory = this.parseChangesHistory(model.changes_history);
        fresh.status = model.status;
        fresh.createdAt = (0, format_date_time_util_1.formatDateTime)(model.created_at);
        fresh.updatedAt = (0, format_date_time_util_1.formatDateTime)(model.updated_at);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.user_customer_id !== undefined && data.user_customer_id !== null) {
            updateData.user_id = String(data.user_customer_id);
        }
        if (data.user_id !== undefined && data.user_id !== null) {
            updateData.user_id = String(data.user_id);
        }
        if (data.channel !== undefined && data.channel !== null) {
            updateData.type = String(data.channel);
        }
        if (data.type !== undefined && data.type !== null) {
            updateData.type = String(data.type);
        }
        if (data.destination !== undefined && data.destination !== null) {
            updateData.sent_to = String(data.destination);
        }
        if (data.sent_to !== undefined && data.sent_to !== null) {
            updateData.sent_to = String(data.sent_to);
        }
        if (data.code !== undefined && data.code !== null) {
            updateData.code = String(data.code);
        }
        if (data.expires_at !== undefined && data.expires_at !== null) {
            updateData.expires_at = new Date(String(data.expires_at));
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
        const model = await this.prisma.userAccessCode.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.userAccessCode.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByCode(code) {
        const model = await this.prisma.userAccessCode.findFirst({
            where: {
                code,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByUserCustomerId(userCustomerId) {
        const rows = await this.prisma.userAccessCode.findMany({
            where: {
                user_id: userCustomerId,
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
            userCustomerId: model.user_id,
            channel: model.type,
            destination: model.sent_to,
            code: model.code,
            expiresAt: (0, format_date_time_util_1.formatDateTime)(model.expires_at),
            usedAt: null,
            sentAt: null,
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
exports.UserAccessCodesRepository = UserAccessCodesRepository;
exports.UserAccessCodesRepository = UserAccessCodesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserAccessCodesRepository);
//# sourceMappingURL=user-access-codes.repository.js.map