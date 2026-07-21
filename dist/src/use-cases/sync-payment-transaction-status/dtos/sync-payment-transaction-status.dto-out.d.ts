import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class SyncPaymentTransactionStatusDtoOut {
    readonly paymentTransaction: PaymentTransactionRow;
    readonly checkoutSession: Record<string, unknown> | null;
    readonly synced: boolean;
    readonly message: string;
    constructor(paymentTransaction: PaymentTransactionRow, checkoutSession: Record<string, unknown> | null, synced: boolean, message: string);
}
