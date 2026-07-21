"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeStripeWebhookService = void 0;
const common_1 = require("@nestjs/common");
const normalized_payment_webhook_event_dto_1 = require("../../../../payment-webhook-events/dtos/normalized-payment-webhook-event.dto");
const normalize_stripe_webhook_dto_out_1 = require("./dtos/normalize-stripe-webhook.dto-out");
let NormalizeStripeWebhookService = class NormalizeStripeWebhookService {
    exec(dtoIn) {
        const eventId = this.getString(dtoIn.payload, 'id');
        if (eventId === null) {
            throw new Error('Stripe event id is required');
        }
        const eventType = this.getString(dtoIn.payload, 'type');
        const data = this.getObject(dtoIn.payload, 'data');
        const object = data ? this.getObject(data, 'object') : null;
        if (eventType === null) {
            throw new Error('Stripe event type is required');
        }
        if (object === null) {
            throw new Error('Stripe event data.object is required');
        }
        const metadata = this.getObject(object, 'metadata') ?? {};
        const normalizedEvent = new normalized_payment_webhook_event_dto_1.NormalizedPaymentWebhookEventDto({
            provider: 'stripe',
            eventId,
            eventType,
            eventAction: eventType,
            canonicalStatus: this.resolveCanonicalStatus({
                eventType,
                object,
            }),
            gatewayTransactionId: this.resolveGatewayTransactionId({
                eventType,
                object,
            }),
            gatewayPaymentIntentId: this.resolveGatewayPaymentIntentId({
                eventType,
                object,
            }),
            gatewayChargeId: this.resolveGatewayChargeId({
                eventType,
                object,
            }),
            gatewaySubscriptionId: this.resolveGatewaySubscriptionId({
                eventType,
                object,
            }),
            gatewayInvoiceId: this.resolveGatewayInvoiceId({
                eventType,
                object,
            }),
            paymentTransactionId: this.getString(metadata, 'paymentTransactionId'),
            checkoutSessionId: this.getString(metadata, 'checkoutSessionId'),
            subscriptionId: this.getString(metadata, 'subscriptionId'),
            subscriptionInvoiceId: this.getString(metadata, 'subscriptionInvoiceId'),
            externalReference: this.getString(metadata, 'externalReference') ??
                this.getString(object, 'client_reference_id'),
            amount: this.resolveAmount({
                eventType,
                object,
            }),
            currency: this.resolveCurrency(object),
            rawPayload: dtoIn.payload,
            headers: dtoIn.headers,
        });
        return new normalize_stripe_webhook_dto_out_1.NormalizeStripeWebhookDtoOut(normalizedEvent);
    }
    resolveCanonicalStatus(params) {
        const status = this.getString(params.object, 'status');
        const paymentStatus = this.getString(params.object, 'payment_status');
        switch (params.eventType) {
            case 'checkout.session.completed':
                return paymentStatus === 'paid' ? 'paid' : 'pending';
            case 'checkout.session.async_payment_succeeded':
            case 'payment_intent.succeeded':
            case 'charge.succeeded':
                return 'paid';
            case 'charge.failed':
            case 'checkout.session.async_payment_failed':
            case 'payment_intent.payment_failed':
                return 'failed';
            case 'payment_intent.processing':
                return 'pending';
            case 'payment_intent.canceled':
                return 'canceled';
            case 'checkout.session.expired':
                return 'expired';
            case 'charge.refunded':
                return 'refunded';
            case 'charge.dispute.created':
                return 'chargeback';
            case 'invoice.paid':
                return 'invoice_paid';
            case 'invoice.payment_failed':
                return 'invoice_payment_failed';
            case 'customer.subscription.updated':
                if (['active', 'trialing'].includes(String(status))) {
                    return 'subscription_active';
                }
                if (['canceled', 'unpaid', 'incomplete_expired'].includes(String(status))) {
                    return 'subscription_canceled';
                }
                return 'ignored';
            case 'customer.subscription.deleted':
                return 'subscription_canceled';
            default:
                return 'ignored';
        }
    }
    resolveGatewayTransactionId(params) {
        const objectId = this.getString(params.object, 'id');
        if (params.eventType.startsWith('checkout.session.')) {
            return objectId;
        }
        if (params.eventType.startsWith('payment_intent.')) {
            return objectId;
        }
        if (params.eventType.startsWith('charge.')) {
            return objectId;
        }
        if (params.eventType.startsWith('invoice.')) {
            return objectId;
        }
        return objectId;
    }
    resolveGatewayPaymentIntentId(params) {
        if (params.eventType.startsWith('payment_intent.')) {
            return this.getString(params.object, 'id');
        }
        return this.getString(params.object, 'payment_intent');
    }
    resolveGatewayChargeId(params) {
        if (params.eventType.startsWith('charge.')) {
            return this.getString(params.object, 'id');
        }
        return this.getString(params.object, 'latest_charge');
    }
    resolveGatewaySubscriptionId(params) {
        if (params.eventType.startsWith('customer.subscription.')) {
            return this.getString(params.object, 'id');
        }
        return this.getString(params.object, 'subscription');
    }
    resolveGatewayInvoiceId(params) {
        if (params.eventType.startsWith('invoice.')) {
            return this.getString(params.object, 'id');
        }
        return this.getString(params.object, 'invoice');
    }
    resolveAmount(params) {
        return (this.getNumber(params.object, 'amount_total') ??
            this.getNumber(params.object, 'amount_paid') ??
            this.getNumber(params.object, 'amount_received') ??
            this.getNumber(params.object, 'amount'));
    }
    resolveCurrency(object) {
        const currency = this.getString(object, 'currency');
        return currency ? currency.toUpperCase() : null;
    }
    getObject(object, key) {
        const value = object[key];
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        return value;
    }
    getString(object, key) {
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
exports.NormalizeStripeWebhookService = NormalizeStripeWebhookService;
exports.NormalizeStripeWebhookService = NormalizeStripeWebhookService = __decorate([
    (0, common_1.Injectable)()
], NormalizeStripeWebhookService);
//# sourceMappingURL=normalize-stripe-webhook.service.js.map