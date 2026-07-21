import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class ProcessPaymentDtoOut {
    readonly checkoutSession: CheckoutSessionRow;
    readonly paymentTransaction: PaymentTransactionRow;
    constructor(checkoutSession: CheckoutSessionRow, paymentTransaction: PaymentTransactionRow);
}
