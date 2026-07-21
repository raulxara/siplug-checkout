export class GetAllSubscriptionInvoicesDtoOut {
  constructor(
    public readonly subscriptionInvoices: Array<Record<string, unknown>>,
  ) {}
}
