import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
export declare class ListCheckoutSessionsByOfficeIdDtoOut {
    readonly checkoutSessions: CheckoutSessionRow[];
    readonly total: number;
    constructor(checkoutSessions: CheckoutSessionRow[], total: number);
}
