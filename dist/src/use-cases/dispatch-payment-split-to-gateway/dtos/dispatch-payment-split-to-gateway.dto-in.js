"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchPaymentSplitToGatewayDtoIn = void 0;
class DispatchPaymentSplitToGatewayDtoIn {
    paymentSplitId;
    sourceTransactionId;
    paymentTransactionId;
    paymentWebhookEventId;
    provider;
    eventId;
    eventType;
    eventAction;
    canonicalStatus;
    constructor(params) {
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        this.sourceTransactionId = String(params.sourceTransactionId ?? '').trim();
        this.paymentTransactionId = String(params.paymentTransactionId ?? '').trim();
        this.paymentWebhookEventId = this.toNullableString(params.paymentWebhookEventId);
        this.provider = String(params.provider ?? '').trim();
        this.eventId = this.toNullableString(params.eventId);
        this.eventType = this.toNullableString(params.eventType);
        this.eventAction = this.toNullableString(params.eventAction);
        this.canonicalStatus = this.toNullableString(params.canonicalStatus);
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
        if (this.sourceTransactionId === '') {
            throw new Error('sourceTransactionId is required');
        }
        if (this.paymentTransactionId === '') {
            throw new Error('paymentTransactionId is required');
        }
        if (this.provider === '') {
            throw new Error('provider is required');
        }
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
}
exports.DispatchPaymentSplitToGatewayDtoIn = DispatchPaymentSplitToGatewayDtoIn;
//# sourceMappingURL=dispatch-payment-split-to-gateway.dto-in.js.map