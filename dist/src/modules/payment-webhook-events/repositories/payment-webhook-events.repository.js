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
exports.PaymentWebhookEventsRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const generate_unique_id_util_1 = require("../../../common/utils/generate-unique-id.util");
const format_date_time_util_1 = require("../../../common/utils/format-date-time.util");
const prisma_service_1 = require("../../../infra/database/prisma/prisma.service");
const payment_webhook_event_entity_1 = require("../entities/payment-webhook-event.entity");
let PaymentWebhookEventsRepository = class PaymentWebhookEventsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        const model = await this.prisma.paymentWebhookEvent.create({
            data: {
                unique_id: entity._id ?? (0, generate_unique_id_util_1.generateUniqueId)(),
                provider: entity.provider,
                event_id: entity.eventId,
                event_type: entity.eventType,
                event_action: entity.eventAction,
                canonical_status: entity.canonicalStatus,
                gateway_transaction_id: entity.gatewayTransactionId,
                gateway_payment_intent_id: entity.gatewayPaymentIntentId,
                gateway_charge_id: entity.gatewayChargeId,
                gateway_subscription_id: entity.gatewaySubscriptionId,
                gateway_invoice_id: entity.gatewayInvoiceId,
                payment_transaction_id: entity.paymentTransactionId,
                checkout_session_id: entity.checkoutSessionId,
                subscription_id: entity.subscriptionId,
                subscription_invoice_id: entity.subscriptionInvoiceId,
                external_reference: entity.externalReference,
                amount: entity.amount,
                currency: entity.currency,
                headers: entity.headers === null
                    ? client_1.Prisma.JsonNull
                    : entity.headers,
                payload: entity.payload === null
                    ? client_1.Prisma.JsonNull
                    : entity.payload,
                normalized_payload: entity.normalizedPayload === null
                    ? client_1.Prisma.JsonNull
                    : entity.normalizedPayload,
                processing_result: entity.processingResult === null
                    ? client_1.Prisma.JsonNull
                    : entity.processingResult,
                error_message: entity.errorMessage,
                received_at: entity.receivedAt ? new Date(entity.receivedAt) : new Date(),
                processed_at: entity.processedAt ? new Date(entity.processedAt) : null,
                metadata: entity.metadata === null
                    ? client_1.Prisma.JsonNull
                    : entity.metadata,
                config: entity.config === null
                    ? client_1.Prisma.JsonNull
                    : entity.config,
                changes_history: entity.changesHistory === null
                    ? client_1.Prisma.JsonNull
                    : entity.changesHistory,
                status: entity.status,
            },
        });
        const fresh = new payment_webhook_event_entity_1.PaymentWebhookEventEntity(this, {
            provider: model.provider,
            eventId: model.event_id,
        });
        this.hydrateEntityFromModel(fresh, model);
        return fresh;
    }
    async updateByUniqueId(_id, data) {
        const updateData = {};
        if (data.provider !== undefined && data.provider !== null) {
            updateData.provider = String(data.provider);
        }
        if (data.event_id !== undefined && data.event_id !== null) {
            updateData.event_id = String(data.event_id);
        }
        if (data.event_type !== undefined && data.event_type !== null) {
            updateData.event_type = String(data.event_type);
        }
        if (data.event_action !== undefined && data.event_action !== null) {
            updateData.event_action = String(data.event_action);
        }
        if (data.canonical_status !== undefined &&
            data.canonical_status !== null) {
            updateData.canonical_status = String(data.canonical_status);
        }
        if (data.gateway_transaction_id !== undefined &&
            data.gateway_transaction_id !== null) {
            updateData.gateway_transaction_id = String(data.gateway_transaction_id);
        }
        if (data.gateway_payment_intent_id !== undefined &&
            data.gateway_payment_intent_id !== null) {
            updateData.gateway_payment_intent_id = String(data.gateway_payment_intent_id);
        }
        if (data.gateway_charge_id !== undefined &&
            data.gateway_charge_id !== null) {
            updateData.gateway_charge_id = String(data.gateway_charge_id);
        }
        if (data.gateway_subscription_id !== undefined &&
            data.gateway_subscription_id !== null) {
            updateData.gateway_subscription_id = String(data.gateway_subscription_id);
        }
        if (data.gateway_invoice_id !== undefined &&
            data.gateway_invoice_id !== null) {
            updateData.gateway_invoice_id = String(data.gateway_invoice_id);
        }
        if (data.payment_transaction_id !== undefined &&
            data.payment_transaction_id !== null) {
            updateData.payment_transaction_id = String(data.payment_transaction_id);
        }
        if (data.checkout_session_id !== undefined &&
            data.checkout_session_id !== null) {
            updateData.checkout_session_id = String(data.checkout_session_id);
        }
        if (data.subscription_id !== undefined &&
            data.subscription_id !== null) {
            updateData.subscription_id = String(data.subscription_id);
        }
        if (data.subscription_invoice_id !== undefined &&
            data.subscription_invoice_id !== null) {
            updateData.subscription_invoice_id = String(data.subscription_invoice_id);
        }
        if (data.external_reference !== undefined &&
            data.external_reference !== null) {
            updateData.external_reference = String(data.external_reference);
        }
        if (data.amount !== undefined && data.amount !== null) {
            updateData.amount = Number(data.amount);
        }
        if (data.currency !== undefined && data.currency !== null) {
            updateData.currency = String(data.currency);
        }
        if (data.headers !== undefined && data.headers !== null) {
            updateData.headers = data.headers;
        }
        if (data.payload !== undefined && data.payload !== null) {
            updateData.payload = data.payload;
        }
        if (data.normalized_payload !== undefined &&
            data.normalized_payload !== null) {
            updateData.normalized_payload =
                data.normalized_payload;
        }
        if (data.processing_result !== undefined &&
            data.processing_result !== null) {
            updateData.processing_result =
                data.processing_result;
        }
        if (data.error_message !== undefined &&
            data.error_message !== null) {
            updateData.error_message = String(data.error_message);
        }
        if (data.received_at !== undefined && data.received_at !== null) {
            updateData.received_at = new Date(String(data.received_at));
        }
        if (data.processed_at !== undefined && data.processed_at !== null) {
            updateData.processed_at = new Date(String(data.processed_at));
        }
        if (data.metadata !== undefined && data.metadata !== null) {
            updateData.metadata = data.metadata;
        }
        if (data.config !== undefined && data.config !== null) {
            updateData.config = data.config;
        }
        if (data.changes_history !== undefined &&
            data.changes_history !== null) {
            updateData.changes_history =
                data.changes_history;
        }
        if (data.status !== undefined && data.status !== null) {
            updateData.status = String(data.status);
        }
        const model = await this.prisma.paymentWebhookEvent.update({
            where: {
                unique_id: _id,
            },
            data: updateData,
        });
        return this.toRow(model);
    }
    async findByUniqueId(_id) {
        const model = await this.prisma.paymentWebhookEvent.findUnique({
            where: {
                unique_id: _id,
            },
        });
        return model ? this.toRow(model) : null;
    }
    async findByProviderAndEventId(params) {
        const model = await this.prisma.paymentWebhookEvent.findUnique({
            where: {
                provider_event_id: {
                    provider: params.provider,
                    event_id: params.eventId,
                },
            },
        });
        return model ? this.toRow(model) : null;
    }
    async getAllByStatus(status) {
        const rows = await this.prisma.paymentWebhookEvent.findMany({
            where: {
                status,
            },
            orderBy: {
                id: 'asc',
            },
        });
        return rows.map((row) => this.toRow(row));
    }
    hydrateEntityFromModel(entity, model) {
        const row = this.toRow(model);
        entity.id = row.id;
        entity._id = row._id;
        entity.provider = row.provider;
        entity.eventId = row.eventId;
        entity.eventType = row.eventType;
        entity.eventAction = row.eventAction;
        entity.canonicalStatus = row.canonicalStatus;
        entity.gatewayTransactionId = row.gatewayTransactionId;
        entity.gatewayPaymentIntentId = row.gatewayPaymentIntentId;
        entity.gatewayChargeId = row.gatewayChargeId;
        entity.gatewaySubscriptionId = row.gatewaySubscriptionId;
        entity.gatewayInvoiceId = row.gatewayInvoiceId;
        entity.paymentTransactionId = row.paymentTransactionId;
        entity.checkoutSessionId = row.checkoutSessionId;
        entity.subscriptionId = row.subscriptionId;
        entity.subscriptionInvoiceId = row.subscriptionInvoiceId;
        entity.externalReference = row.externalReference;
        entity.amount = row.amount;
        entity.currency = row.currency;
        entity.headers = row.headers;
        entity.payload = row.payload;
        entity.normalizedPayload = row.normalizedPayload;
        entity.processingResult = row.processingResult;
        entity.errorMessage = row.errorMessage;
        entity.receivedAt = row.receivedAt;
        entity.processedAt = row.processedAt;
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
            provider: model.provider,
            eventId: model.event_id,
            eventType: model.event_type,
            eventAction: model.event_action,
            canonicalStatus: model.canonical_status,
            gatewayTransactionId: model.gateway_transaction_id,
            gatewayPaymentIntentId: model.gateway_payment_intent_id,
            gatewayChargeId: model.gateway_charge_id,
            gatewaySubscriptionId: model.gateway_subscription_id,
            gatewayInvoiceId: model.gateway_invoice_id,
            paymentTransactionId: model.payment_transaction_id,
            checkoutSessionId: model.checkout_session_id,
            subscriptionId: model.subscription_id,
            subscriptionInvoiceId: model.subscription_invoice_id,
            externalReference: model.external_reference,
            amount: model.amount,
            currency: model.currency,
            headers: this.parseJsonObject(model.headers),
            payload: this.parseJsonObject(model.payload),
            normalizedPayload: this.parseJsonObject(model.normalized_payload),
            processingResult: this.parseJsonObject(model.processing_result),
            errorMessage: model.error_message,
            receivedAt: model.received_at ? (0, format_date_time_util_1.formatDateTime)(model.received_at) : null,
            processedAt: model.processed_at ? (0, format_date_time_util_1.formatDateTime)(model.processed_at) : null,
            metadata: this.parseJsonObject(model.metadata),
            config: this.parseJsonObject(model.config),
            changesHistory: this.parseJsonArray(model.changes_history),
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
    parseJsonArray(value) {
        if (!Array.isArray(value)) {
            return null;
        }
        return value;
    }
};
exports.PaymentWebhookEventsRepository = PaymentWebhookEventsRepository;
exports.PaymentWebhookEventsRepository = PaymentWebhookEventsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentWebhookEventsRepository);
//# sourceMappingURL=payment-webhook-events.repository.js.map