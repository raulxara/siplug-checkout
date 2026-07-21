import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';

export class GetPaymentCustomersByOfficeIdDtoOut {
  constructor(
    public readonly paymentCustomers: PaymentCustomerRow[],
    public readonly total: number,
  ) {}
}