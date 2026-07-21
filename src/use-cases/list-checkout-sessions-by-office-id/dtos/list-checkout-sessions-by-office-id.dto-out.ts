import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

export class ListCheckoutSessionsByOfficeIdDtoOut {
  constructor(
    public readonly checkoutSessions: CheckoutSessionRow[],
    public readonly total: number,
  ) {}
}
