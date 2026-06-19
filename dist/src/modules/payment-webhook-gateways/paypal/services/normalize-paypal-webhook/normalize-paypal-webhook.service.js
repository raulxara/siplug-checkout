"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizePayPalWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_paypal_webhook_dto_out_1 = require("./dtos/normalize-paypal-webhook.dto-out");
let NormalizePayPalWebhookService = class NormalizePayPalWebhookService {
    exec(dtoIn) {
        const eventId = this.getString(dtoIn.payload, 'id');
        const eventType = this.getString(dtoIn.payload, 'event_type');
        const resource = this.getObject(dtoIn.payload, 'resource');
        if (eventId === null) {
            throw new Error('PayPal webhook id is required');
        }
        if (eventType === null) {
            throw new Error('PayPal webhook event_type is required');
        }
        if (resource === null) {
            throw new Error('PayPal webhook resource is required');
        }
        const gatewayTransactionId = this.resolveGatewayTransactionId({
            eventType,
            resource,
        });
        const gatewayChargeId = this.resolveGatewayChargeId({
            eventType,
            resource,
        });
        const amount = this.resolveAmount(resource);
        const currency = this.resolveCurrency(resource);
        const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'paypal',
            eventId,
            eventType,
            eventAction: eventType,
            canonicalStatus: this.resolveCanonicalStatus({
                eventType,
                resource,
            }),
            gatewayTransactionId,
            gatewayPaymentIntentId: gatewayTransactionId,
            gatewayChargeId,
            gatewaySubscriptionId: this.resolveGatewaySubscriptionId({
                eventType,
                resource,
            }),
            gatewayInvoiceId: null,
            paymentTransactionId: this.resolvePaymentTransactionId(resource),
            checkoutSessionId: null,
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: this.getString(resource, 'invoice_id') ??
                this.getString(resource, 'custom_id') ??
                gatewayTransactionId,
            amount,
            currency,
            rawPayload: dtoIn.payload,
            headers: dtoIn.headers,
        });
        return new normalize_paypal_webhook_dto_out_1.NormalizePayPalWebhookDtoOut(normalizedEvent);
    }
    resolveCanonicalStatus(params) {
        const eventType = params.eventType.toUpperCase().trim();
        const status = this.getString(params.resource, 'status')?.toUpperCase();
        switch (eventType) {
            case 'CHECKOUT.ORDER.APPROVED':
                return 'pending';
            case 'CHECKOUT.ORDER.COMPLETED':
                return 'paid';
            case 'CHECKOUT.PAYMENT-APPROVAL.REVERSED':
                return 'canceled';
            case 'PAYMENT.CAPTURE.COMPLETED':
                return 'paid';
            case 'PAYMENT.CAPTURE.PENDING':
                return 'pending';
            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.DECLINED':
            case 'PAYMENT.CAPTURE.FAILED':
                return 'failed';
            case 'PAYMENT.CAPTURE.REFUNDED':
            case 'PAYMENT.CAPTURE.PARTIALLY_REFUNDED':
                return 'refunded';
            case 'PAYMENT.CAPTURE.REVERSED':
                return 'chargeback';
            default:
                if (status === 'COMPLETED') {
                    return 'paid';
                }
                if (status === 'PENDING') {
                    return 'pending';
                }
                if (status === 'DENIED' || status === 'FAILED') {
                    return 'failed';
                }
                return 'ignored';
        }
    }
    resolveGatewayTransactionId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.startsWith('CHECKOUT.ORDER.')) {
            return this.getString(params.resource, 'id');
        }
        const supplementaryData = this.getObject(params.resource, 'supplementary_data');
        const relatedIds = supplementaryData
            ? this.getObject(supplementaryData, 'related_ids')
            : null;
        return (this.getString(relatedIds, 'order_id') ??
            this.getString(params.resource, 'order_id') ??
            this.getString(params.resource, 'id'));
    }
    resolveGatewayChargeId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.startsWith('PAYMENT.CAPTURE.')) {
            return this.getString(params.resource, 'id');
        }
        return null;
    }
    resolveGatewaySubscriptionId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.includes('BILLING.SUBSCRIPTION')) {
            return this.getString(params.resource, 'id');
        }
        return null;
    }
    resolvePaymentTransactionId(resource) {
        return (this.getString(resource, 'custom_id') ??
            this.getString(resource, 'custom'));
    }
    resolveAmount(resource) {
        const amount = this.getObject(resource, 'amount');
        const value = this.getString(amount, 'value');
        if (value === null) {
            return null;
        }
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return null;
        }
        return Math.round(parsed * 100);
    }
    resolveCurrency(resource) {
        const amount = this.getObject(resource, 'amount');
        return this.getString(amount, 'currency_code');
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
};
exports.NormalizePayPalWebhookService = NormalizePayPalWebhookService;
exports.NormalizePayPalWebhookService = NormalizePayPalWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizePayPalWebhookService);
//# sourceMappingURL=normalize-paypal-webhook.service.js.map