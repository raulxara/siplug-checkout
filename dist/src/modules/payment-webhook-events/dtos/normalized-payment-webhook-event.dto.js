"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizedPaymentWebhookEventDto = void 0;
class NormalizedPaymentWebhookEventDto {
    provider;
    eventId;
    eventType;
    eventAction;
    canonicalStatus;
    gatewayTransactionId;
    gatewayPaymentIntentId;
    gatewayChargeId;
    gatewaySubscriptionId;
    gatewayInvoiceId;
    paymentTransactionId;
    checkoutSessionId;
    subscriptionId;
    subscriptionInvoiceId;
    externalReference;
    amount;
    currency;
    rawPayload;
    headers;
    constructor(params) {
        this.provider = this.parseProvider(params.provider);
        this.eventId = String(params.eventId ?? '').trim();
        this.eventType = this.toNullableString(params.eventType);
        this.eventAction = this.toNullableString(params.eventAction);
        this.canonicalStatus = this.parseCanonicalStatus(params.canonicalStatus);
        this.gatewayTransactionId = this.toNullableString(params.gatewayTransactionId);
        this.gatewayPaymentIntentId = this.toNullableString(params.gatewayPaymentIntentId);
        this.gatewayChargeId = this.toNullableString(params.gatewayChargeId);
        this.gatewaySubscriptionId = this.toNullableString(params.gatewaySubscriptionId);
        this.gatewayInvoiceId = this.toNullableString(params.gatewayInvoiceId);
        this.paymentTransactionId = this.toNullableString(params.paymentTransactionId);
        this.checkoutSessionId = this.toNullableString(params.checkoutSessionId);
        this.subscriptionId = this.toNullableString(params.subscriptionId);
        this.subscriptionInvoiceId = this.toNullableString(params.subscriptionInvoiceId);
        this.externalReference = this.toNullableString(params.externalReference);
        this.amount = this.toNullableNumber(params.amount);
        this.currency = this.toNullableString(params.currency);
        this.rawPayload = this.toObject(params.rawPayload);
        this.headers = this.toObject(params.headers);
        if (this.eventId === '') {
            throw new Error('eventId is required');
        }
    }
    parseProvider(value) {
        const provider = String(value ?? '').trim();
        const allowedProviders = [
            'stripe',
            'mercado_pago',
            'pagseguro',
            'paypal',
            'picpay',
            'infinity_pay',
        ];
        if (!allowedProviders.includes(provider)) {
            throw new Error(`invalid webhook provider: ${provider}`);
        }
        return provider;
    }
    parseCanonicalStatus(value) {
        const canonicalStatus = String(value ?? '').trim();
        const allowedStatuses = [
            'pending',
            'authorized',
            'paid',
            'failed',
            'canceled',
            'expired',
            'refunded',
            'chargeback',
            'subscription_active',
            'subscription_canceled',
            'invoice_paid',
            'invoice_payment_failed',
            'ignored',
        ];
        if (!allowedStatuses.includes(canonicalStatus)) {
            throw new Error(`invalid webhook canonicalStatus: ${canonicalStatus}`);
        }
        return canonicalStatus;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toNullableNumber(value) {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        const numberValue = Number(value);
        if (Number.isNaN(numberValue)) {
            throw new Error('amount must be a valid number');
        }
        return numberValue;
    }
    toObject(value) {
        if (value === undefined || value === null) {
            return {};
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.NormalizedPaymentWebhookEventDto = NormalizedPaymentWebhookEventDto;
//# sourceMappingURL=normalized-payment-webhook-event.dto.js.map