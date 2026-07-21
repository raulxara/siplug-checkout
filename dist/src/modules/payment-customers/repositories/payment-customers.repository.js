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
exports.PaymentCustomersRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const payment_customer_entity_1 = require("../entities/payment-customer.entity");
let PaymentCustomersRepository = class PaymentCustomersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.paymentCustomer.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                profile_id: entity.profileId,
                external_reference: entity.externalReference,
                name: entity.name,
                email: entity.email,
                document_type: entity.documentType,
                document_value: entity.documentValue,
                phone: entity.phone,
                billing_address: entity.billingAddress === null
                    ? client_1.Prisma.JsonNull
                    : entity.billingAddress,
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
        const fresh = new payment_customer_entity_1.PaymentCustomerEntity(this);
        fresh.id = model.id;
        fresh._id = model.unique_id;
        fresh.officeId = model.office_id;
        fresh.clientId = model.client_id;
        fresh.profileId = model.profile_id;
        fresh.externalReference = model.external_reference;
        fresh.name = model.name;
        fresh.email = model.email;
        fresh.documentType = model.document_type;
        fresh.documentValue = model.document_value;
        fresh.phone = model.phone;
        fresh.billingAddress = this.parseJsonObject(model.billing_address);
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
        if (data.profile_id !== undefined && data.profile_id !== null) {
            updateData.profile_id = String(data.profile_id);
        }
        if (data.external_reference !== undefined &&
            data.external_reference !== null) {
            updateData.external_reference = String(data.external_reference);
        }
        if (data.name !== undefined && data.name !== null) {
            updateData.name = String(data.name);
        }
        if (data.email !== undefined && data.email !== null) {
            updateData.email = String(data.email);
        }
        if (data.document_type !== undefined && data.document_type !== null) {
            updateData.document_type = String(data.document_type);
        }
        if (data.document_value !== undefined && data.document_value !== null) {
            updateData.document_value = String(data.document_value);
        }
        if (data.phone !== undefined && data.phone !== null) {
            updateData.phone = String(data.phone);
        }
        if (data.billing_address !== undefined && data.billing_address !== null) {
            updateData.billing_address =
                data.billing_address;
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
        const model = await this.prisma.paymentCustomer.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.paymentCustomer.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.paymentCustomer.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.paymentCustomer.findMany({
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
            profileId: model.profile_id,
            externalReference: model.external_reference,
            name: model.name,
            email: model.email,
            documentType: model.document_type,
            documentValue: model.document_value,
            phone: model.phone,
            billingAddress: this.parseJsonObject(model.billing_address),
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
exports.PaymentCustomersRepository = PaymentCustomersRepository;
exports.PaymentCustomersRepository = PaymentCustomersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentCustomersRepository);
//# sourceMappingURL=payment-customers.repository.js.map