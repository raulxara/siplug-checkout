import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class GetAllPaymentTransactionsDtoOut {
  constructor(public readonly paymentTransactions: PaymentTransactionRow[]) {}
}
