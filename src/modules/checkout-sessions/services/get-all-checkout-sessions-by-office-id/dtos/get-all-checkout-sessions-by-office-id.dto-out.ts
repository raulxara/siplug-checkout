import type { CheckoutSessionRow } from '../../../entities/checkout-sessions-repository.interface';

export class GetAllCheckoutSessionsByOfficeIdDtoOut {
  constructor(
    public readonly items: CheckoutSessionRow[],
    public readonly total: number,
  ) {}
}