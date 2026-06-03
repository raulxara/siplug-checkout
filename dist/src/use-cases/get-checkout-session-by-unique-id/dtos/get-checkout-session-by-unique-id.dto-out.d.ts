import type { CheckoutSessionItemRow } from '../../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
export declare class GetCheckoutSessionByUniqueIdDtoOut {
    readonly checkoutSession: CheckoutSessionRow;
    readonly items: CheckoutSessionItemRow[];
    constructor(checkoutSession: CheckoutSessionRow, items: CheckoutSessionItemRow[]);
}
