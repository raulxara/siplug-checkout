import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';
export declare class GetAllPaymentTransactionsDtoOut {
    readonly paymentTransactions: PaymentTransactionRow[];
    constructor(paymentTransactions: PaymentTransactionRow[]);
}
