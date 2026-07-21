import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';
export declare class UpdatePaymentTransactionDtoOut {
    readonly paymentTransaction: PaymentTransactionRow;
    constructor(paymentTransaction: PaymentTransactionRow);
}
