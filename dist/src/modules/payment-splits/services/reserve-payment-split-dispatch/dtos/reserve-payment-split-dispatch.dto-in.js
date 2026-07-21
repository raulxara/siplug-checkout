"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservePaymentSplitDispatchDtoIn = void 0;
class ReservePaymentSplitDispatchDtoIn {
    paymentSplitId;
    paymentTransactionId;
    provider;
    sourceTransactionId;
    webhookEventId;
    webhookEventType;
    source;
    constructor(params) {
        this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
        this.paymentTransactionId =
            params.paymentTransactionId !== undefined &&
                params.paymentTransactionId !== null
                ? String(params.paymentTransactionId).trim()
                : null;
        this.provider = String(params.provider ?? '').trim();
        this.sourceTransactionId = String(params.sourceTransactionId ?? '').trim();
        this.webhookEventId =
            params.webhookEventId !== undefined && params.webhookEventId !== null
                ? String(params.webhookEventId).trim()
                : null;
        this.webhookEventType =
            params.webhookEventType !== undefined &&
                params.webhookEventType !== null
                ? String(params.webhookEventType).trim()
                : null;
        this.source = String(params.source ?? 'ReservePaymentSplitDispatchService').trim();
        if (this.paymentSplitId === '') {
            throw new Error('paymentSplitId is required');
        }
        if (this.provider === '') {
            throw new Error('provider is required');
        }
        if (this.sourceTransactionId === '') {
            throw new Error('sourceTransactionId is required');
        }
    }
}
exports.ReservePaymentSplitDispatchDtoIn = ReservePaymentSplitDispatchDtoIn;
//# sourceMappingURL=reserve-payment-split-dispatch.dto-in.js.map