import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';
export declare class FindCheckoutSessionByUniqueIdDtoOut {
    readonly checkoutSession: CheckoutSessionRow;
    constructor(checkoutSession: CheckoutSessionRow);
}
