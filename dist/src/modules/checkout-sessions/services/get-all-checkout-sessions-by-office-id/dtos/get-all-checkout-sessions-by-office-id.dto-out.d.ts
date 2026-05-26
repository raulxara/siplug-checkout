import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';
export declare class GetAllCheckoutSessionsByOfficeIdDtoOut {
    readonly items: CheckoutSessionRow[];
    readonly total: number;
    constructor(items: CheckoutSessionRow[], total: number);
}
