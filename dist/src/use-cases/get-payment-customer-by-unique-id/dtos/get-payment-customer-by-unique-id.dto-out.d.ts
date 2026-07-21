import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';
export declare class GetPaymentCustomerByUniqueIdDtoOut {
    readonly paymentCustomer: PaymentCustomerRow;
    constructor(paymentCustomer: PaymentCustomerRow);
}
