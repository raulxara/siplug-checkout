export class ListSubscriptionInvoicesDtoOut {
  constructor(
    public readonly subscriptionInvoices: Array<Record<string, unknown>>,
  ) {}
}
