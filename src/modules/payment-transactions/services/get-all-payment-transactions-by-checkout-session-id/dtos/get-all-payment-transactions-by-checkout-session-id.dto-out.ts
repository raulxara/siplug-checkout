import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class GetAllPaymentTransactionsByCheckoutSessionIdDtoOut {
  constructor(
    public readonly items: PaymentTransactionRow[],
    public readonly total: number,
  ) {}
}
