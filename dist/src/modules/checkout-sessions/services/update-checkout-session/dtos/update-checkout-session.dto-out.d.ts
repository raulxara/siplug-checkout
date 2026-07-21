import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';
export declare class UpdateCheckoutSessionDtoOut {
    readonly checkoutSession: CheckoutSessionRow;
    constructor(checkoutSession: CheckoutSessionRow);
}
