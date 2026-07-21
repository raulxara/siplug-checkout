import type { PaymentCustomerRow } from '../../../modules/payment-customers/entities/payment-customers-repository.interface';

export class ListPaymentCustomersDtoOut {
  constructor(
    public readonly officeId: string,
    public readonly items: PaymentCustomerRow[],
    public readonly total: number,
    public readonly page: number,
    public readonly perPage: number,
    public readonly totalPages: number,
  ) {}
}