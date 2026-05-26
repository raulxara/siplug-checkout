import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';

export class UpdateCheckoutSessionDtoOut {
  constructor(public readonly checkoutSession: CheckoutSessionRow) {}
}