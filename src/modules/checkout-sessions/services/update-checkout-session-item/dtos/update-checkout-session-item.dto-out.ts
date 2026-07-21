import type { CheckoutSessionItemRow } from '../../../entities/checkout-session-items-repository.interface';

export class UpdateCheckoutSessionItemDtoOut {
  constructor(public readonly checkoutSessionItem: CheckoutSessionItemRow) {}
}