import type { PaymentTransactionRow } from '../../../entities/payment-transactions-repository.interface';

export class FindPaymentTransactionByGatewayTransactionIdDtoOut {
  constructor(
    public readonly paymentTransaction: PaymentTransactionRow,
  ) {}
}