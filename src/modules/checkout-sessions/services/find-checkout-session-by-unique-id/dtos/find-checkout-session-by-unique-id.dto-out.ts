import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';

export class FindCheckoutSessionByUniqueIdDtoOut {
  constructor(public readonly checkoutSession: CheckoutSessionRow) {}
}