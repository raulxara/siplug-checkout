import type { SubscriptionInvoiceRow } from '../../../entities/subscription-invoices-repository.interface';

export class FindSubscriptionInvoiceByUniqueIdDtoOut {
  constructor(public readonly subscriptionInvoice: SubscriptionInvoiceRow) {}
}
