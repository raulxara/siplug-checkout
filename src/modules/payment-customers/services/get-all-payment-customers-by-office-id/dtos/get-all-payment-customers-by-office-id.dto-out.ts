import type { PaymentCustomerRow } from '../../../entities/payment-customers-repository.interface';

export class GetAllPaymentCustomersByOfficeIdDtoOut {
  constructor(
    public readonly items: PaymentCustomerRow[],
    public readonly total: number,
  ) {}
}