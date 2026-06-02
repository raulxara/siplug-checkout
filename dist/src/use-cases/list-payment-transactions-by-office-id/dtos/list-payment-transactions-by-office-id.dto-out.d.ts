import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class ListPaymentTransactionsByOfficeIdDtoOut {
    readonly paymentTransactions: PaymentTransactionRow[];
    constructor(paymentTransactions: PaymentTransactionRow[]);
}
