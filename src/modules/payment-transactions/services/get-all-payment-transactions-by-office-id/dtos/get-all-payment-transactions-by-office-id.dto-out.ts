import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class GetAllPaymentTransactionsByOfficeIdDtoOut {
  constructor(
    public readonly items: PaymentTransactionRow[],
    public readonly total: number,
  ) {}
}
