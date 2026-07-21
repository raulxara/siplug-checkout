import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';
export declare class FindPaymentTransactionByUniqueIdDtoOut {
    readonly paymentTransaction: PaymentTransactionRow;
    constructor(paymentTransaction: PaymentTransactionRow);
}
