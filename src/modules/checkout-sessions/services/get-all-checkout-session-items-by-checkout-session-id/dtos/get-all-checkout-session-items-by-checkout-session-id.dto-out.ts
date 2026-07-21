import type { CheckoutSessionItemRow } from '../../../entities/checkout-session-items-repository.interface';

export class GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut {
  constructor(
    public readonly items: CheckoutSessionItemRow[],
    public readonly total: number,
  ) {}
}