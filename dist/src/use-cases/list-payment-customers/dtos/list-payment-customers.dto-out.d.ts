import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';
export declare class ListPaymentCustomersDtoOut {
    readonly officeId: string;
    readonly items: PaymentCustomerRow[];
    readonly total: number;
    readonly page: number;
    readonly perPage: number;
    readonly totalPages: number;
    constructor(officeId: string, items: PaymentCustomerRow[], total: number, page: number, perPage: number, totalPages: number);
}
