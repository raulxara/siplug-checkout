import type { SubscriptionInvoiceRow } from '../../../entities/subscription-invoices-repository.interface';

export class CreateSubscriptionInvoiceDtoOut {
  constructor(
    public readonly subscriptionInvoice: SubscriptionInvoiceRow,
  ) {}
}