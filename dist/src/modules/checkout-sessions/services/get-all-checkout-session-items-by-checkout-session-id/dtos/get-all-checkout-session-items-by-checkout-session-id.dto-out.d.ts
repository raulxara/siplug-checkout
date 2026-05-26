import type { CheckoutSessionItemRow } from '../../../entities/checkout-session-items-repository.interface';
export declare class GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut {
    readonly items: CheckoutSessionItemRow[];
    readonly total: number;
    constructor(items: CheckoutSessionItemRow[], total: number);
}
