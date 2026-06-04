import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import type { SubscriptionCycleRow } from '../../../modules/subscription-cycles/entities/subscription-cycles-repository.interface';
import type { SubscriptionInvoiceRow } from '../../../modules/subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';

export class ProcessRecurringPaymentDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
    public readonly subscriptionCycle: SubscriptionCycleRow,
    public readonly subscriptionInvoice: SubscriptionInvoiceRow,
    public readonly paymentTransaction: PaymentTransactionRow,
    public readonly checkoutSession: Record<string, unknown> | null,
  ) {}
}
