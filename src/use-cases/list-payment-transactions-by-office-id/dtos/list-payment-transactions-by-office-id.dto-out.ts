import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class ListPaymentTransactionsByOfficeIdDtoOut {
  constructor(public readonly paymentTransactions: PaymentTransactionRow[]) {}
}
