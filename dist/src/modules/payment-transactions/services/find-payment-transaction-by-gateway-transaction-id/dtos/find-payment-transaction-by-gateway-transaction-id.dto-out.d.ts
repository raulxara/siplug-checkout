import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';
export declare class FindPaymentTransactionByGatewayTransactionIdDtoOut {
    readonly paymentTransaction: PaymentTransactionRow;
    constructor(paymentTransaction: PaymentTransactionRow);
}
