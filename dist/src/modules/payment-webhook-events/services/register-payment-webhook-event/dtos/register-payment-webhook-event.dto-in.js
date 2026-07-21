"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPaymentWebhookEventDtoIn = void 0;
class RegisterPaymentWebhookEventDtoIn {
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
    headers;
    payload;
    normalizedPayload;
    metadata;
    config;
    constructor(params) {
        this.provider = String(params.provider ?? '').trim();
        this.eventId = String(params.eventId ?? '').trim();
        this.eventType = this.toNullableString(params.eventType);
        this.eventAction = this.toNullableString(params.eventAction);
        this.canonicalStatus = this.toNullableString(params.canonicalStatus);
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
        this.headers = this.toNullableObject(params.headers);
        this.payload = this.toNullableObject(params.payload);
        this.normalizedPayload = this.toNullableObject(params.normalizedPayload);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        if (this.provider === '') {
            throw new Error('provider is required');
        }
        if (this.eventId === '') {
            throw new Error('eventId is required');
        }
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
    toNullableObject(value) {
        if (value === undefined || value === null) {
            return null;
        }
        if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('value must be an object');
        }
        return value;
    }
}
exports.RegisterPaymentWebhookEventDtoIn = RegisterPaymentWebhookEventDtoIn;
//# sourceMappingURL=register-payment-webhook-event.dto-in.js.map