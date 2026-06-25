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
        const gatewaySubscriptionId = this.resolveGatewaySubscriptionId({
            eventType,
            resource,
        });
        const gatewayInvoiceId = this.resolveGatewayInvoiceId({
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
            gatewaySubscriptionId,
            gatewayInvoiceId,
            paymentTransactionId: this.resolvePaymentTransactionId(resource),
            checkoutSessionId: null,
            subscriptionId: null,
            subscriptionInvoiceId: null,
            externalReference: this.getString(resource, 'invoice_id') ??
                this.getString(resource, 'custom_id') ??
                this.getString(resource, 'custom') ??
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
            case 'BILLING.SUBSCRIPTION.CREATED':
            case 'BILLING.SUBSCRIPTION.APPROVAL_PENDING':
                return 'pending';
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                return 'subscription_active';
            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.CANCELED':
            case 'BILLING.SUBSCRIPTION.EXPIRED':
                return 'subscription_canceled';
            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                return 'subscription_canceled';
            case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                return 'invoice_payment_failed';
            case 'PAYMENT.SALE.COMPLETED':
                return 'invoice_paid';
            case 'PAYMENT.SALE.PENDING':
                return 'pending';
            case 'PAYMENT.SALE.DENIED':
            case 'PAYMENT.SALE.FAILED':
                return 'invoice_payment_failed';
            case 'PAYMENT.SALE.REFUNDED':
            case 'PAYMENT.SALE.REVERSED':
                return 'refunded';
            default:
                if (status === 'COMPLETED') {
                    return 'paid';
                }
                if (status === 'ACTIVE') {
                    return 'subscription_active';
                }
                if (status === 'PENDING' || status === 'APPROVAL_PENDING') {
                    return 'pending';
                }
                if (status === 'CANCELLED' || status === 'CANCELED') {
                    return 'subscription_canceled';
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
        if (eventType.includes('BILLING.SUBSCRIPTION')) {
            return this.getString(params.resource, 'id');
        }
        const supplementaryData = this.getObject(params.resource, 'supplementary_data');
        const relatedIds = supplementaryData
            ? this.getObject(supplementaryData, 'related_ids')
            : null;
        return (this.getString(relatedIds, 'order_id') ??
            this.getString(relatedIds, 'authorization_id') ??
            this.getString(relatedIds, 'sale_id') ??
            this.getString(params.resource, 'order_id') ??
            this.getString(params.resource, 'parent_payment') ??
            this.getString(params.resource, 'billing_agreement_id') ??
            this.getString(params.resource, 'subscription_id') ??
            this.getString(params.resource, 'id'));
    }
    resolveGatewayChargeId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.startsWith('PAYMENT.CAPTURE.') ||
            eventType.startsWith('PAYMENT.SALE.')) {
            return this.getString(params.resource, 'id');
        }
        return null;
    }
    resolveGatewaySubscriptionId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.includes('BILLING.SUBSCRIPTION')) {
            return this.getString(params.resource, 'id');
        }
        return (this.getString(params.resource, 'billing_agreement_id') ??
            this.getString(params.resource, 'subscription_id'));
    }
    resolveGatewayInvoiceId(params) {
        const eventType = params.eventType.toUpperCase().trim();
        if (eventType.startsWith('PAYMENT.SALE.') ||
            eventType === 'BILLING.SUBSCRIPTION.PAYMENT.FAILED') {
            return (this.getString(params.resource, 'invoice_id') ??
                this.getString(params.resource, 'invoice_number') ??
                this.getString(params.resource, 'id'));
        }
        return (this.getString(params.resource, 'invoice_id') ??
            this.getString(params.resource, 'invoice_number'));
    }
    resolvePaymentTransactionId(resource) {
        return (this.getString(resource, 'custom_id') ??
            this.getString(resource, 'custom'));
    }
    resolveAmount(resource) {
        const amount = this.getObject(resource, 'amount');
        const value = this.getString(amount, 'value') ??
            this.getString(amount, 'total');
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
        return (this.getString(amount, 'currency_code') ??
            this.getString(amount, 'currency'));
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