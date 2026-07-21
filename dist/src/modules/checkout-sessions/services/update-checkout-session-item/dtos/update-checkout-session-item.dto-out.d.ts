import type { CheckoutSessionItemRow } from '../../../entities/checkout-session-items-repository.interface';
export declare class UpdateCheckoutSessionItemDtoOut {
    readonly checkoutSessionItem: CheckoutSessionItemRow;
    constructor(checkoutSessionItem: CheckoutSessionItemRow);
}
