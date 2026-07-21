"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentWebhookEventEntity = void 0;
class PaymentWebhookEventEntity {
    repository;
    id = null;
    _id = null;
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
    processingResult;
    errorMessage;
    receivedAt;
    processedAt;
    metadata;
    config;
    changesHistory;
    status;
    createdAt = null;
    updatedAt = null;
    constructor(repository, params) {
        this.repository = repository;
        this.provider = params.provider;
        this.eventId = params.eventId;
        this.eventType = params.eventType ?? null;
        this.eventAction = params.eventAction ?? null;
        this.canonicalStatus = params.canonicalStatus ?? null;
        this.gatewayTransactionId = params.gatewayTransactionId ?? null;
        this.gatewayPaymentIntentId = params.gatewayPaymentIntentId ?? null;
        this.gatewayChargeId = params.gatewayChargeId ?? null;
        this.gatewaySubscriptionId = params.gatewaySubscriptionId ?? null;
        this.gatewayInvoiceId = params.gatewayInvoiceId ?? null;
        this.paymentTransactionId = params.paymentTransactionId ?? null;
        this.checkoutSessionId = params.checkoutSessionId ?? null;
        this.subscriptionId = params.subscriptionId ?? null;
        this.subscriptionInvoiceId = params.subscriptionInvoiceId ?? null;
        this.externalReference = params.externalReference ?? null;
        this.amount = params.amount ?? null;
        this.currency = params.currency ?? null;
        this.headers = params.headers ?? null;
        this.payload = params.payload ?? null;
        this.normalizedPayload = params.normalizedPayload ?? null;
        this.processingResult = params.processingResult ?? null;
        this.errorMessage = params.errorMessage ?? null;
        this.receivedAt = params.receivedAt ?? null;
        this.processedAt = params.processedAt ?? null;
        this.metadata = params.metadata ?? null;
        this.config = params.config ?? null;
        this.changesHistory = params.changesHistory ?? null;
        this.status = params.status ?? 'received';
    }
    async create() {
        if (!this.repository) {
            throw new Error('payment webhook events repository is required');
        }
        return this.repository.create(this);
    }
}
exports.PaymentWebhookEventEntity = PaymentWebhookEventEntity;
//# sourceMappingURL=payment-webhook-event.entity.js.map