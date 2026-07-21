import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class GetPaymentTransactionByUniqueIdDtoOut {
  constructor(public readonly paymentTransaction: PaymentTransactionRow) {}
}
