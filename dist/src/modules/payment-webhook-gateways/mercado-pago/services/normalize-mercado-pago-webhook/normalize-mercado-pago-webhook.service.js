"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeMercadoPagoWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_mercado_pago_webhook_dto_out_1 = require("./dtos/normalize-mercado-pago-webhook.dto-out");
let NormalizeMercadoPagoWebhookService = class NormalizeMercadoPagoWebhookService {
    exec(dtoIn) {
        const paymentId = this.getString(dtoIn.payment, 'id');
        if (paymentId === null) {
            throw new Error('Mercado Pago payment id is required');
        }
        const metadata = this.getObject(dtoIn.payment, 'metadata') ?? {};
        const payloadData = this.getObject(dtoIn.payload, 'data') ?? {};
        const payloadType = this.getString(dtoIn.payload, 'type') ??
            this.getString(dtoIn.queryParams, 'type') ??
            'payment';
        const action = this.getString(dtoIn.payload, 'action') ??
            this.getString(dtoIn.queryParams, 'action') ??
            `payment.${this.getString(dtoIn.payment, 'status') ?? 'updated'}`;
        const status = this.getString(dtoIn.payment, 'status');
        const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'mercado_pago',
            eventId: this.getString(dtoIn.payload, 'id') ??
                this.getString(dtoIn.queryParams, 'id') ??
                this.getString(payloadData, 'id') ??
                `${payloadType}:${paymentId}:${action}:${status ?? 'unknown'}`,
            eventType: payloadType,
            eventAction: action,
            canonicalStatus: this.resolveCanonicalStatus(status),
            gatewayTransactionId: paymentId,
            gatewayPaymentIntentId: null,
            gatewayChargeId: null,
            gatewaySubscriptionId: this.getString(dtoIn.payment, 'preapproval_id'),
            gatewayInvoiceId: null,
            paymentTransactionId: this.getString(metadata, 'paymentTransactionId') ??
                this.getString(metadata, 'payment_transaction_id'),
            checkoutSessionId: this.getString(metadata, 'checkoutSessionId') ??
                this.getString(metadata, 'checkout_session_id'),
            subscriptionId: this.getString(metadata, 'subscriptionId') ??
                this.getString(metadata, 'subscription_id'),
            subscriptionInvoiceId: this.getString(metadata, 'subscriptionInvoiceId') ??
                this.getString(metadata, 'subscription_invoice_id'),
            externalReference: this.getString(dtoIn.payment, 'external_reference') ??
                this.getString(metadata, 'externalReference') ??
                this.getString(metadata, 'external_reference'),
            amount: this.resolveAmount(dtoIn.payment),
            currency: this.resolveCurrency(dtoIn.payment),
            rawPayload: {
                notification: dtoIn.payload,
                payment: dtoIn.payment,
                queryParams: dtoIn.queryParams,
            },
            headers: dtoIn.headers,
        });
        return new normalize_mercado_pago_webhook_dto_out_1.NormalizeMercadoPagoWebhookDtoOut(normalizedEvent);
    }
    resolveCanonicalStatus(status) {
        switch (status) {
            case 'approved':
                return 'paid';
            case 'authorized':
                return 'authorized';
            case 'pending':
            case 'in_process':
                return 'pending';
            case 'rejected':
                return 'failed';
            case 'cancelled':
            case 'canceled':
                return 'canceled';
            case 'refunded':
                return 'refunded';
            case 'charged_back':
                return 'chargeback';
            default:
                return 'ignored';
        }
    }
    resolveAmount(payment) {
        const value = this.getNumber(payment, 'transaction_amount') ??
            this.getNumber(payment, 'total_paid_amount');
        if (value === null) {
            return null;
        }
        return Math.round(value * 100);
    }
    resolveCurrency(payment) {
        const currency = this.getString(payment, 'currency_id');
        return currency ? currency.toUpperCase() : null;
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
        const value = object[key];
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? null : numberValue;
    }
};
exports.NormalizeMercadoPagoWebhookService = NormalizeMercadoPagoWebhookService;
exports.NormalizeMercadoPagoWebhookService = NormalizeMercadoPagoWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizeMercadoPagoWebhookService);
//# sourceMappingURL=normalize-mercado-pago-webhook.service.js.map