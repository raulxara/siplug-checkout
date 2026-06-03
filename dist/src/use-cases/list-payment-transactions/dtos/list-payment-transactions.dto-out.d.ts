import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class ListPaymentTransactionsDtoOut {
    readonly paymentTransactions: PaymentTransactionRow[];
    constructor(paymentTransactions: PaymentTransactionRow[]);
}
