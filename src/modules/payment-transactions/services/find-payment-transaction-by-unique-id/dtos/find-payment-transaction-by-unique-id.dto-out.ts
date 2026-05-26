import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class FindPaymentTransactionByUniqueIdDtoOut {
  constructor(public readonly paymentTransaction: PaymentTransactionRow) {}
}
