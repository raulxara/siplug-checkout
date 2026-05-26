import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';

export class GetAllPaymentCustomersDtoOut {
  constructor(
    public readonly items: PaymentCustomerRow[],
    public readonly total: number,
  ) {}
}