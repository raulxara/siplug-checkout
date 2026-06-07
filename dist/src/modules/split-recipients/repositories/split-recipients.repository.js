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
exports.SplitRecipientsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const split_recipient_entity_1 = require("../entities/split-recipient.entity");
let SplitRecipientsRepository = class SplitRecipientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const data = {
            unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
            office_id: entity.officeId,
            client_id: entity.clientId,
            gateway_id: entity.gatewayId,
            api_credential_id: entity.apiCredentialId,
            name: entity.name,
            document_type: entity.documentType,
            document_value: entity.documentValue,
            email: entity.email,
            gateway_provider: entity.gatewayProvider,
            gateway_recipient_id: entity.gatewayRecipientId,
            gateway_account_id: entity.gatewayAccountId,
            bank_data: entity.bankData === null
                ? client_1.Prisma.JsonNull
                : entity.bankData,
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
        const model = await this.prisma.splitRecipient.create({
            data,
        });
        const fresh = new split_recipient_entity_1.SplitRecipientEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.gatewayId = model.gateway_id;
        fresh.apiCredentialId = model.api_credential_id;
        fresh.name = model.name;
        fresh.documentType = model.document_type;
        fresh.documentValue = model.document_value;
        fresh.email = model.email;
        fresh.gatewayProvider = model.gateway_provider;
        fresh.gatewayRecipientId = model.gateway_recipient_id;
        fresh.gatewayAccountId = model.gateway_account_id;
        fresh.bankData = this.parseJsonObject(model.bank_data);
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
        if (data.name !== undefined && data.name !== null) {
            updateData.name = String(data.name);
        }
        if (data.document_type !== undefined && data.document_type !== null) {
            updateData.document_type = String(data.document_type);
        }
        if (data.document_value !== undefined && data.document_value !== null) {
            updateData.document_value = String(data.document_value);
        }
        if (data.email !== undefined && data.email !== null) {
            updateData.email = String(data.email);
        }
        if (data.gateway_provider !== undefined && data.gateway_provider !== null) {
            updateData.gateway_provider = String(data.gateway_provider);
        }
        if (data.gateway_recipient_id !== undefined &&
            data.gateway_recipient_id !== null) {
            updateData.gateway_recipient_id = String(data.gateway_recipient_id);
        }
        if (data.gateway_account_id !== undefined &&
            data.gateway_account_id !== null) {
            updateData.gateway_account_id = String(data.gateway_account_id);
        }
        if (data.bank_data !== undefined && data.bank_data !== null) {
            updateData.bank_data = data.bank_data;
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
        const model = await this.prisma.splitRecipient.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.splitRecipient.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByGatewayRecipientId(gatewayProvider, gatewayRecipientId) {
        const model = await this.prisma.splitRecipient.findFirst({
            where: {
                gateway_provider: gatewayProvider,
                gateway_recipient_id: gatewayRecipientId,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.splitRecipient.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.splitRecipient.findMany({
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
            gatewayId: model.gateway_id,
            apiCredentialId: model.api_credential_id,
            name: model.name,
            documentType: model.document_type,
            documentValue: model.document_value,
            email: model.email,
            gatewayProvider: model.gateway_provider,
            gatewayRecipientId: model.gateway_recipient_id,
            gatewayAccountId: model.gateway_account_id,
            bankData: this.parseJsonObject(model.bank_data),
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
exports.SplitRecipientsRepository = SplitRecipientsRepository;
exports.SplitRecipientsRepository = SplitRecipientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SplitRecipientsRepository);
//# sourceMappingURL=split-recipients.repository.js.map