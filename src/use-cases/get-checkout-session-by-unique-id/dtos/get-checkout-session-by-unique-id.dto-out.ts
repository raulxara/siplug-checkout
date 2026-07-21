import type { CheckoutSessionItemRow } from '../../../modules/checkout-sessions/entities/checkout-session-items-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

export class GetCheckoutSessionByUniqueIdDtoOut {
  constructor(
    public readonly checkoutSession: CheckoutSessionRow,
    public readonly items: CheckoutSessionItemRow[],
  ) {}
}