import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';
export declare class GetAllPaymentCustomersDtoOut {
    readonly items: PaymentCustomerRow[];
    readonly total: number;
    constructor(items: PaymentCustomerRow[], total: number);
}
