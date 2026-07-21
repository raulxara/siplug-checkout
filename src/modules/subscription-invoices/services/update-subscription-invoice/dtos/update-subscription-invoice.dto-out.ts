import type { SubscriptionInvoiceRow } from '../../../entities/subscription-invoices-repository.interface';

export class UpdateSubscriptionInvoiceDtoOut {
  constructor(public readonly subscriptionInvoice: SubscriptionInvoiceRow) {}
}
