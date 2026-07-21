import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';
export declare class GetAllPaymentTransactionsByOfficeIdDtoOut {
    readonly items: PaymentTransactionRow[];
    readonly total: number;
    constructor(items: PaymentTransactionRow[], total: number);
}
