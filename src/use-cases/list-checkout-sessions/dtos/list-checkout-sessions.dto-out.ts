import type { CheckoutSessionItemRow } from '../../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

export type ListCheckoutSessionsItem = {
  checkoutSession: CheckoutSessionRow;
  items: CheckoutSessionItemRow[];
};

export class ListCheckoutSessionsDtoOut {
  constructor(
    public readonly officeId: string,
    public readonly items: ListCheckoutSessionsItem[],
    public readonly total: number,
    public readonly page: number,
    public readonly perPage: number,
    public readonly totalPages: number,
  ) {}
}