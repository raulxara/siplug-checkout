import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';
export declare class UpdatePaymentCustomerDtoOut {
    readonly paymentCustomer: PaymentCustomerRow;
    constructor(paymentCustomer: PaymentCustomerRow);
}
