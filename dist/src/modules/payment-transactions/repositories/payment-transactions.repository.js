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
exports.PaymentTransactionsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const payment_transaction_entity_1 = require("../entities/payment-transaction.entity");
let PaymentTransactionsRepository = class PaymentTransactionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.paymentTransaction.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                office_id: entity.officeId,
                client_id: entity.clientId,
                checkout_session_id: entity.checkoutSessionId,
                payment_customer_id: entity.paymentCustomerId,
                gateway_id: entity.gatewayId,
                api_credential_id: entity.apiCredentialId,
                gateway_transaction_id: entity.gatewayTransactionId,
                external_reference: entity.externalReference,
                idempotency_key: entity.idempotencyKey,
                payment_type: entity.paymentType,
                payment_method: entity.paymentMethod,
                amount: entity.amount,
                currency: entity.currency,
                installments: entity.installments,
                installment_amount: entity.installmentAmount,
                interest_amount: entity.interestAmount,
                interest_type: entity.interestType,
                gateway_status: entity.gatewayStatus,
                status: entity.status ?? 'created',
                process_status: entity.processStatus ?? 'pending',
                process_message: entity.processMessage,
                provider_payload: entity.providerPayload === null
                    ? client_1.Prisma.JsonNull
                    : entity.providerPayload,
                provider_response: entity.providerResponse === null
                    ? client_1.Prisma.JsonNull
                    : entity.providerResponse,
                gateway_response: entity.gatewayResponse === null
                    ? client_1.Prisma.JsonNull
                    : entity.gatewayResponse,
                qr_code: entity.qrCode,
                qr_code_base64: entity.qrCodeBase64,
                boleto_url: entity.boletoUrl,
                checkout_url: entity.checkoutUrl,
                split_required: entity.splitRequired,
                has_split: entity.hasSplit,
                paid_at: entity.paidAt ? new Date(entity.paidAt) : null,
                authorized_at: entity.authorizedAt
                    ? new Date(entity.authorizedAt)
                    : null,
                canceled_at: entity.canceledAt ? new Date(entity.canceledAt) : null,
                failed_at: entity.failedAt ? new Date(entity.failedAt) : null,
                refunded_at: entity.refundedAt ? new Date(entity.refundedAt) : null,
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
            },
        });
        const fresh = new payment_transaction_entity_1.PaymentTransactionEntity(this);
        this.hydrateEntityFromModel(fresh, model);
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
        if (data.checkout_session_id !== undefined &&
            data.checkout_session_id !== null) {
            updateData.checkout_session_id = String(data.checkout_session_id);
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
        if (data.gateway_transaction_id !== undefined &&
            data.gateway_transaction_id !== null) {
            updateData.gateway_transaction_id = String(data.gateway_transaction_id);
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
        if (data.payment_method !== undefined && data.payment_method !== null) {
            updateData.payment_method = String(data.payment_method);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.installments !== undefined && data.installments !== null) {
            updateData.installments = Number(data.installments);
        }
        if (data.installment_amount !== undefined &&
            data.installment_amount !== null) {
            updateData.installment_amount = Number(data.installment_amount);
        }
        if (data.interest_amount !== undefined && data.interest_amount !== null) {
            updateData.interest_amount = Number(data.interest_amount);
        }
        if (data.interest_type !== undefined && data.interest_type !== null) {
            updateData.interest_type = String(data.interest_type);
        }
        if (data.gateway_status !== undefined && data.gateway_status !== null) {
            updateData.gateway_status = String(data.gateway_status);
        }
        if (data.status !== undefined && data.status !== null) {
            updateData.status = String(data.status);
        }
        if (data.process_status !== undefined && data.process_status !== null) {
            updateData.process_status = String(data.process_status);
        }
        if (data.process_message !== undefined && data.process_message !== null) {
            updateData.process_message = String(data.process_message);
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
        if (data.gateway_response !== undefined &&
            data.gateway_response !== null) {
            updateData.gateway_response =
                data.gateway_response;
        }
        if (data.qr_code !== undefined && data.qr_code !== null) {
            updateData.qr_code = String(data.qr_code);
        }
        if (data.qr_code_base64 !== undefined && data.qr_code_base64 !== null) {
            updateData.qr_code_base64 = String(data.qr_code_base64);
        }
        if (data.boleto_url !== undefined && data.boleto_url !== null) {
            updateData.boleto_url = String(data.boleto_url);
        }
        if (data.checkout_url !== undefined && data.checkout_url !== null) {
            updateData.checkout_url = String(data.checkout_url);
        }
        if (data.split_required !== undefined && data.split_required !== null) {
            updateData.split_required = Boolean(data.split_required);
        }
        if (data.has_split !== undefined && data.has_split !== null) {
            updateData.has_split = Boolean(data.has_split);
        }
        if (data.paid_at !== undefined && data.paid_at !== null) {
            updateData.paid_at = new Date(String(data.paid_at));
        }
        if (data.authorized_at !== undefined && data.authorized_at !== null) {
            updateData.authorized_at = new Date(String(data.authorized_at));
        }
        if (data.canceled_at !== undefined && data.canceled_at !== null) {
            updateData.canceled_at = new Date(String(data.canceled_at));
        }
        if (data.failed_at !== undefined && data.failed_at !== null) {
            updateData.failed_at = new Date(String(data.failed_at));
        }
        if (data.refunded_at !== undefined && data.refunded_at !== null) {
            updateData.refunded_at = new Date(String(data.refunded_at));
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
        const model = await this.prisma.paymentTransaction.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.paymentTransaction.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByGatewayTransactionId(gatewayTransactionId) {
        const model = await this.prisma.paymentTransaction.findFirst({
            where: {
                gateway_transaction_id: gatewayTransactionId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAll() {
        const rows = await this.prisma.paymentTransaction.findMany({
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByOfficeId(officeId) {
        const rows = await this.prisma.paymentTransaction.findMany({
            where: {
                office_id: officeId,
            },
            orderBy: {
                id: 'desc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    async getAllByCheckoutSessionId(checkoutSessionId) {
        const rows = await this.prisma.paymentTransaction.findMany({
            where: {
                checkout_session_id: checkoutSessionId,
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
        entity.officeId = row.officeId;
        entity.clientId = row.clientId;
        entity.checkoutSessionId = row.checkoutSessionId;
        entity.paymentCustomerId = row.paymentCustomerId;
        entity.gatewayId = row.gatewayId;
        entity.apiCredentialId = row.apiCredentialId;
        entity.gatewayTransactionId = row.gatewayTransactionId;
        entity.externalReference = row.externalReference;
        entity.idempotencyKey = row.idempotencyKey;
        entity.paymentType = row.paymentType;
        entity.paymentMethod = row.paymentMethod;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.installments = row.installments;
        entity.installmentAmount = row.installmentAmount;
        entity.interestAmount = row.interestAmount;
        entity.interestType = row.interestType;
        entity.gatewayStatus = row.gatewayStatus;
        entity.status = row.status;
        entity.processStatus = row.processStatus;
        entity.processMessage = row.processMessage;
        entity.providerPayload = row.providerPayload;
        entity.providerResponse = row.providerResponse;
        entity.gatewayResponse = row.gatewayResponse;
        entity.qrCode = row.qrCode;
        entity.qrCodeBase64 = row.qrCodeBase64;
        entity.boletoUrl = row.boletoUrl;
        entity.checkoutUrl = row.checkoutUrl;
        entity.splitRequired = row.splitRequired;
        entity.hasSplit = row.hasSplit;
        entity.paidAt = row.paidAt;
        entity.authorizedAt = row.authorizedAt;
        entity.canceledAt = row.canceledAt;
        entity.failedAt = row.failedAt;
        entity.refundedAt = row.refundedAt;
        entity.expiresAt = row.expiresAt;
        entity.metadata = row.metadata;
        entity.config = row.config;
        entity.changesHistory = row.changesHistory;
        entity.createdAt = row.createdAt;
        entity.updatedAt = row.updatedAt;
    }
    toRow(model) {
        return {
            id: model.id,
            _id: model.unique_id,
            officeId: model.office_id,
            clientId: model.client_id,
            checkoutSessionId: model.checkout_session_id,
            paymentCustomerId: model.payment_customer_id,
            gatewayId: model.gateway_id,
            apiCredentialId: model.api_credential_id,
            gatewayTransactionId: model.gateway_transaction_id,
            externalReference: model.external_reference,
            idempotencyKey: model.idempotency_key,
            paymentType: model.payment_type,
            paymentMethod: model.payment_method,
            amount: model.amount,
            currency: model.currency,
            installments: model.installments,
            installmentAmount: model.installment_amount,
            interestAmount: model.interest_amount,
            interestType: model.interest_type,
            gatewayStatus: model.gateway_status,
            status: model.status,
            processStatus: model.process_status,
            processMessage: model.process_message,
            providerPayload: this.parseJsonObject(model.provider_payload),
            providerResponse: this.parseJsonObject(model.provider_response),
            gatewayResponse: this.parseJsonObject(model.gateway_response),
            qrCode: model.qr_code,
            qrCodeBase64: model.qr_code_base64,
            boletoUrl: model.boleto_url,
            checkoutUrl: model.checkout_url,
            splitRequired: Boolean(model.split_required),
            hasSplit: Boolean(model.has_split),
            paidAt: model.paid_at ? (0, format_date_time_util_1.formatDateTime)(model.paid_at) : null,
            authorizedAt: model.authorized_at
                ? (0, format_date_time_util_1.formatDateTime)(model.authorized_at)
                : null,
            canceledAt: model.canceled_at ? (0, format_date_time_util_1.formatDateTime)(model.canceled_at) : null,
            failedAt: model.failed_at ? (0, format_date_time_util_1.formatDateTime)(model.failed_at) : null,
            refundedAt: model.refunded_at ? (0, format_date_time_util_1.formatDateTime)(model.refunded_at) : null,
            expiresAt: model.expires_at ? (0, format_date_time_util_1.formatDateTime)(model.expires_at) : null,
            metadata: this.parseJsonObject(model.metadata),
            config: this.parseJsonObject(model.config),
            changesHistory: this.parseChangesHistory(model.changes_history),
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
exports.PaymentTransactionsRepository = PaymentTransactionsRepository;
exports.PaymentTransactionsRepository = PaymentTransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentTransactionsRepository);
//# sourceMappingURL=payment-transactions.repository.js.map