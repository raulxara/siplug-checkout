import type { CheckoutSessionItemRow } from '../../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
export type ListCheckoutSessionsItem = {
    checkoutSession: CheckoutSessionRow;
    items: CheckoutSessionItemRow[];
};
export declare class ListCheckoutSessionsDtoOut {
    readonly officeId: string;
    readonly items: ListCheckoutSessionsItem[];
    readonly total: number;
    readonly page: number;
    readonly perPage: number;
    readonly totalPages: number;
    constructor(officeId: string, items: ListCheckoutSessionsItem[], total: number, page: number, perPage: number, totalPages: number);
}
