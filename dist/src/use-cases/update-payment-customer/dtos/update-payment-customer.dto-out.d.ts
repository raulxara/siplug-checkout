import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';
export declare class UpdatePaymentCustomerDtoOut {
    readonly paymentCustomer: PaymentCustomerRow;
    constructor(paymentCustomer: PaymentCustomerRow);
}
