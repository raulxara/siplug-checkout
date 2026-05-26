import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';
export declare class FindPaymentCustomerByUniqueIdDtoOut {
    readonly paymentCustomer: PaymentCustomerRow;
    constructor(paymentCustomer: PaymentCustomerRow);
}
