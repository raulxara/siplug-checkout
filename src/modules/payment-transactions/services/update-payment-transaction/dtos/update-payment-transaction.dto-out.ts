import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class UpdatePaymentTransactionDtoOut {
  constructor(public readonly paymentTransaction: PaymentTransactionRow) {}
}
