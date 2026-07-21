"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaySplitTransferDtoIn = void 0;
class GatewaySplitTransferDtoIn {
    gatewayProvider;
    providerToken;
    paymentSplitId;
    paymentTransactionId;
    paymentWebhookEventId;
    sourceTransactionId;
    idempotencyKey;
    recipients;
    metadata;
    config;
    constructor(params) {
        this.gatewayProvider = String(params.gatewayProvider ?? '').trim();
        this.providerToken = String(params.providerToken ?? '').trim();
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        this.paymentTransactionId = String(params.paymentTransactionId ?? '').trim();
        this.paymentWebhookEventId = this.toNullableString(params.paymentWebhookEventId);
        this.sourceTransactionId = String(params.sourceTransactionId ?? '').trim();
        this.idempotencyKey = String(params.idempotencyKey ?? '').trim();
        this.recipients = params.recipients ?? [];
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        if (this.gatewayProvider === '') {
            throw new Error('gatewayProvider is required');
        }
        if (this.providerToken === '') {
            throw new Error('providerToken is required');
        }
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
        if (this.paymentTransactionId === '') {
            throw new Error('paymentTransactionId is required');
        }
        if (this.sourceTransactionId === '') {
            throw new Error('sourceTransactionId is required');
        }
        if (this.idempotencyKey === '') {
            throw new Error('idempotencyKey is required');
        }
        if (!Array.isArray(this.recipients) || this.recipients.length === 0) {
            throw new Error('recipients must have at least one item');
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
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
exports.GatewaySplitTransferDtoIn = GatewaySplitTransferDtoIn;
//# sourceMappingURL=gateway-split-transfer.dto-in.js.map