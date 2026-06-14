"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentSplitLifecycleDtoIn = void 0;
class UpdatePaymentSplitLifecycleDtoIn {
    token;
    paymentSplitId;
    status;
    gatewaySplitId;
    providerPayload;
    providerResponse;
    gatewayResponse;
    metadata;
    config;
    recipients;
    constructor(params) {
        this.token = String(params.token ?? '').trim();
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        this.status = String(params.status ?? '').trim();
        this.gatewaySplitId = this.toNullableString(params.gatewaySplitId);
        this.providerPayload = this.toNullableObject(params.providerPayload);
        this.providerResponse = this.toNullableObject(params.providerResponse);
        this.gatewayResponse = this.toNullableObject(params.gatewayResponse);
        this.metadata = this.toNullableObject(params.metadata);
        this.config = this.toNullableObject(params.config);
        this.recipients = this.parseRecipients(params.recipients);
        if (this.token === '') {
            throw new Error('token is required');
        }
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
        if (this.status === '') {
            throw new Error('status is required');
        }
        this.validateStatus(this.status);
    }
    parseRecipients(value) {
        if (value === undefined || value === null) {
            return [];
        }
        if (!Array.isArray(value)) {
            throw new Error('recipients must be an array');
        }
        return value.map((item) => this.parseRecipient(item));
    }
    parseRecipient(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('recipient item must be an object');
        }
        const item = value;
        const paymentSplitRecipientId = this.toNullableString(item.paymentSplitRecipientId);
        const splitRecipientId = this.toNullableString(item.splitRecipientId);
        if (paymentSplitRecipientId === null && splitRecipientId === null) {
            throw new Error('recipient.paymentSplitRecipientId or recipient.splitRecipientId is required');
        }
        const status = this.toNullableString(item.status);
        if (status !== null) {
            this.validateStatus(status);
        }
        return {
            paymentSplitRecipientId,
            splitRecipientId,
            status,
            gatewayRecipientId: this.toNullableString(item.gatewayRecipientId),
            gatewayTransferId: this.toNullableString(item.gatewayTransferId),
            providerPayload: this.toNullableObject(item.providerPayload),
            providerResponse: this.toNullableObject(item.providerResponse),
            gatewayResponse: this.toNullableObject(item.gatewayResponse),
            metadata: this.toNullableObject(item.metadata),
            config: this.toNullableObject(item.config),
        };
    }
    validateStatus(status) {
        const allowedStatuses = [
            'created',
            'pending_gateway',
            'transferred',
            'failed',
            'refunded',
        ];
        if (!allowedStatuses.includes(status)) {
            throw new Error(`invalid status: ${status}`);
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
exports.UpdatePaymentSplitLifecycleDtoIn = UpdatePaymentSplitLifecycleDtoIn;
//# sourceMappingURL=update-payment-split-lifecycle.dto-in.js.map