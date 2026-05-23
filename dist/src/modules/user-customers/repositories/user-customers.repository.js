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
exports.UserCustomersRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const user_customer_entity_1 = require("../entities/user-customer.entity");
let UserCustomersRepository = class UserCustomersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            client_id: entity.clientId,
            profile_id: entity.profileId,
            token: entity.token,
            two_fa_required: entity.twoFaRequired,
            two_fa_active: entity.twoFaActive,
            config: entity.config === null
                ? client_1.Prisma.JsonNull
                : entity.config,
            changes_history: entity.changesHistory === null
                ? client_1.Prisma.JsonNull
                : entity.changesHistory,
            status: entity.status ?? 'active',
        };
        const model = await this.prisma.userCustomer.create({
            data,
        });
        const fresh = new user_customer_entity_1.UserCustomerEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.clientId = model.client_id;
        fresh.profileId = model.profile_id;
        fresh.token = model.token;
        fresh.twoFaRequired = model.two_fa_required;
        fresh.twoFaActive = model.two_fa_active;
        fresh.config = this.parseJsonObject(model.config);
        fresh.changesHistory = this.parseChangesHistory(model.changes_history);
        fresh.status = model.status;
        fresh.createdAt = (0, format_date_time_util_1.formatDateTime)(model.created_at);
        fresh.updatedAt = (0, format_date_time_util_1.formatDateTime)(model.updated_at);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.client_id !== undefined && data.client_id !== null) {
            updateData.client_id = String(data.client_id);
        }
        if (data.profile_id !== undefined && data.profile_id !== null) {
            updateData.profile_id = String(data.profile_id);
        }
        if (data.token !== undefined && data.token !== null) {
            updateData.token = String(data.token);
        }
        if (data.two_fa_required !== undefined &&
            data.two_fa_required !== null) {
            updateData.two_fa_required = Boolean(data.two_fa_required);
        }
        if (data.two_fa_active !== undefined && data.two_fa_active !== null) {
            updateData.two_fa_active = Boolean(data.two_fa_active);
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
        const model = await this.prisma.userCustomer.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.userCustomer.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByToken(token) {
        const model = await this.prisma.userCustomer.findUnique({
            where: {
                token,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.userCustomer.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByClientId(clientId) {
        const rows = await this.prisma.userCustomer.findMany({
            where: {
                client_id: clientId,
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
            clientId: model.client_id,
            profileId: model.profile_id,
            token: model.token,
            twoFaRequired: model.two_fa_required,
            twoFaActive: model.two_fa_active,
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
exports.UserCustomersRepository = UserCustomersRepository;
exports.UserCustomersRepository = UserCustomersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserCustomersRepository);
//# sourceMappingURL=user-customers.repository.js.map