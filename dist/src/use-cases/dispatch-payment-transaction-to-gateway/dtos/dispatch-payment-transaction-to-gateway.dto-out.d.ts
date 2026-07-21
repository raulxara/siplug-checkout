import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class DispatchPaymentTransactionToGatewayDtoOut {
    readonly paymentTransaction: PaymentTransactionRow;
    constructor(paymentTransaction: PaymentTransactionRow);
}
