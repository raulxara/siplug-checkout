import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class ListPaymentTransactionsDtoOut {
  constructor(public readonly paymentTransactions: PaymentTransactionRow[]) {}
}
