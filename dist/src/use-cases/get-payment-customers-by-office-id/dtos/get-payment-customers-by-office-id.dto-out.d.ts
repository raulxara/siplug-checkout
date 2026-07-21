import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';
export declare class GetPaymentCustomersByOfficeIdDtoOut {
    readonly paymentCustomers: PaymentCustomerRow[];
    readonly total: number;
    constructor(paymentCustomers: PaymentCustomerRow[], total: number);
}
