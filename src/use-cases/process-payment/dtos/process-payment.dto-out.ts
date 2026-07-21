import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class ProcessPaymentDtoOut {
  constructor(
    public readonly checkoutSession: CheckoutSessionRow,
    public readonly paymentTransaction: PaymentTransactionRow,
  ) {}
}
