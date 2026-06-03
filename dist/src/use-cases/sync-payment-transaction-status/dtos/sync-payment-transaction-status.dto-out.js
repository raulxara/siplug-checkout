"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncPaymentTransactionStatusDtoOut = void 0;
class SyncPaymentTransactionStatusDtoOut {
    paymentTransaction;
    checkoutSession;
    synced;
    message;
    constructor(paymentTransaction, checkoutSession, synced, message) {
        this.paymentTransaction = paymentTransaction;
        this.checkoutSession = checkoutSession;
        this.synced = synced;
        this.message = message;
    }
}
exports.SyncPaymentTransactionStatusDtoOut = SyncPaymentTransactionStatusDtoOut;
//# sourceMappingURL=sync-payment-transaction-status.dto-out.js.map