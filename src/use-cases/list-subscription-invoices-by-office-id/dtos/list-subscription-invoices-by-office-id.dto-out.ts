export class ListSubscriptionInvoicesByOfficeIdDtoOut {
  constructor(
    public readonly subscriptionInvoices: Array<Record<string, unknown>>,
  ) {}
}
