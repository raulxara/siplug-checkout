"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizePicPayWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_picpay_webhook_dto_out_1 = require("./dtos/normalize-picpay-webhook.dto-out");
let NormalizePicPayWebhookService = class NormalizePicPayWebhookService {
    exec(dtoIn) {
        const data = this.resolveDataPayload(dtoIn.payload);
        const transactions = this.resolveTransactions(data, dtoIn.payload);
        const primaryTransaction = this.resolvePrimaryTransaction(transactions);
        const merchantChargeId = this.getString(data, 'merchantChargeId') ??
            this.getString(dtoIn.payload, 'merchantChargeId');
        const smartCheckoutId = this.getString(data, 'smartCheckoutId') ??
            this.getString(dtoIn.payload, 'smartCheckoutId');
        const rootEventId = this.getString(dtoIn.payload, 'id');
        const transactionId = this.getString(primaryTransaction, 'transactionId') ??
            this.getString(primaryTransaction, 'id');
        const transactionStatus = this.getString(primaryTransaction, 'status') ??
            this.getString(primaryTransaction, 'transactionStatus');
        const chargeStatus = transactionStatus ??
            this.getString(data, 'status') ??
            this.getString(dtoIn.payload, 'chargeStatus') ??
            this.getString(dtoIn.payload, 'status');
        const status = chargeStatus ?? 'UNKNOWN';
        const paymentType = this.getString(primaryTransaction, 'paymentType') ??
            this.getString(data, 'paymentType');
        const gatewayTransactionId = merchantChargeId ?? transactionId ?? rootEventId;
        const eventId = this.resolveEventId({
            rootEventId,
            merchantChargeId,
            transactionId,
            status,
        });
        const amount = this.getNumber(primaryTransaction, 'amount') ??
            this.getNumber(data, 'amount') ??
            this.getNumber(dtoIn.payload, 'amount');
        const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'picpay',
            eventId,
            eventType: this.resolveEventType(dtoIn.eventTypeHeader),
            eventAction: this.resolveEventAction(status),
            canonicalStatus: this.resolveCanonicalStatus(status),
            gatewayTransactionId,
            gatewayPaymentIntentId: smartCheckoutId,
            gatewayChargeId: transactionId,
            gatewaySubscriptionId: null,
            gatewayInvoiceId: null,
            paymentTransactionId: null,
            checkoutSessionId: null,
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: merchantChargeId,
            amount,
            currency: 'BRL',
            rawPayload: {
                picpay: dtoIn.payload,
            },
            headers: dtoIn.headers,
        });
        return new normalize_picpay_webhook_dto_out_1.NormalizePicPayWebhookDtoOut(normalizedEvent);
    }
    resolveDataPayload(payload) {
        const data = this.getObject(payload, 'data');
        return data ?? payload;
    }
    resolveTransactions(data, payload) {
        const dataTransactions = this.getObjectsArray(data, 'transactions');
        if (dataTransactions.length > 0) {
            return dataTransactions;
        }
        return this.getObjectsArray(payload, 'transactions');
    }
    resolvePrimaryTransaction(transactions) {
        if (transactions.length === 0) {
            return null;
        }
        const paidTransaction = transactions.find((transaction) => {
            const status = this.getString(transaction, 'status') ??
                this.getString(transaction, 'transactionStatus');
            return ['CAPTURED', 'PAID'].includes(String(status ?? '').toUpperCase());
        });
        return paidTransaction ?? transactions[0];
    }
    resolveEventId(params) {
        if (params.rootEventId !== null) {
            return params.rootEventId;
        }
        const base = params.merchantChargeId ?? params.transactionId ?? 'unknown-picpay-event';
        return `${base}:${params.status}`;
    }
    resolveEventType(eventTypeHeader) {
        if (eventTypeHeader !== null) {
            return eventTypeHeader;
        }
        return 'charge';
    }
    resolveEventAction(status) {
        return `charge.${status.toLowerCase()}`;
    }
    resolveCanonicalStatus(status) {
        const normalized = String(status ?? '').trim().toUpperCase();
        switch (normalized) {
            case 'CAPTURED':
            case 'PAID':
                return 'paid';
            case 'AUTHORIZED':
            case 'PRE_AUTHORIZED':
                return 'authorized';
            case 'PENDING':
            case 'CREATED':
            case 'PROCESSING':
                return 'pending';
            case 'DENIED':
            case 'ERROR':
            case 'FAILED':
                return 'failed';
            case 'CANCELED':
            case 'CANCELLED':
                return 'canceled';
            case 'EXPIRED':
                return 'expired';
            case 'REFUNDED':
            case 'PARTIALLY_REFUNDED':
            case 'PARTIAL':
                return 'refunded';
            case 'CHARGEBACK':
                return 'chargeback';
            default:
                return 'ignored';
        }
    }
    getObjectsArray(object, key) {
        const value = object[key];
        if (!Array.isArray(value)) {
            return [];
        }
        return value.filter((item) => !!item && typeof item === 'object' && !Array.isArray(item));
    }
    getObject(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    getString(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    getNumber(object, key) {
        if (object === null) {
            return null;
        }
        const value = object[key];
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? null : numberValue;
    }
};
exports.NormalizePicPayWebhookService = NormalizePicPayWebhookService;
exports.NormalizePicPayWebhookService = NormalizePicPayWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizePicPayWebhookService);
//# sourceMappingURL=normalize-picpay-webhook.service.js.map