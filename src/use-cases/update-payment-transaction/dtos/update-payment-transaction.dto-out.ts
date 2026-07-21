import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class UpdatePaymentTransactionUseCaseDtoOut {
  constructor(public readonly paymentTransaction: PaymentTransactionRow) {}
}
