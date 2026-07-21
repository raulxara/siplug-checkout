import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class SyncPaymentTransactionStatusDtoOut {
  constructor(
    public readonly paymentTransaction: PaymentTransactionRow,
    public readonly checkoutSession: Record<string, unknown> | null,
    public readonly synced: boolean,
    public readonly message: string,
  ) {}
}
