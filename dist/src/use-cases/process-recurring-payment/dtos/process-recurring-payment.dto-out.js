"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessRecurringPaymentDtoOut = void 0;
class ProcessRecurringPaymentDtoOut {
    subscription;
    subscriptionCycle;
    subscriptionInvoice;
    paymentTransaction;
    checkoutSession;
    constructor(subscription, subscriptionCycle, subscriptionInvoice, paymentTransaction, checkoutSession) {
        this.subscription = subscription;
        this.subscriptionCycle = subscriptionCycle;
        this.subscriptionInvoice = subscriptionInvoice;
        this.paymentTransaction = paymentTransaction;
        this.checkoutSession = checkoutSession;
    }
}
exports.ProcessRecurringPaymentDtoOut = ProcessRecurringPaymentDtoOut;
//# sourceMappingURL=process-recurring-payment.dto-out.js.map