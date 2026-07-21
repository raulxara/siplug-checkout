import type { SubscriptionCycleRow } from '../../../modules/subscription-cycles/entities/subscription-cycles-repository.interface';
import type { SubscriptionInvoiceRow } from '../../../modules/subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';

export class GenerateSubscriptionInvoiceDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
    public readonly subscriptionCycle: SubscriptionCycleRow,
    public readonly subscriptionInvoice: SubscriptionInvoiceRow,
  ) {}
}