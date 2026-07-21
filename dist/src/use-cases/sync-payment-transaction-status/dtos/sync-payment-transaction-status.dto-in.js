"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPaymentTransactionStatusDtoIn = void 0;
class SyncPaymentTransactionStatusDtoIn {
    token;
    paymentTransactionId;
    force;
    constructor(params) {
        if (!params.token || params.token.trim() === '') {
            throw new Error('token is required');
        }
        if (!params.paymentTransactionId ||
            params.paymentTransactionId.trim() === '') {
            throw new Error('paymentTransactionId is required');
        }
        this.token = params.token.trim();
        this.paymentTransactionId = params.paymentTransactionId.trim();
        this.force = Boolean(params.force);
    }
}
exports.SyncPaymentTransactionStatusDtoIn = SyncPaymentTransactionStatusDtoIn;
//# sourceMappingURL=sync-payment-transaction-status.dto-in.js.map