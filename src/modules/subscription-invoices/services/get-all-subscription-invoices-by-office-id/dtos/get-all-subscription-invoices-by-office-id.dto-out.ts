export class GetAllSubscriptionInvoicesByOfficeIdDtoOut {
  constructor(
    public readonly subscriptionInvoices: Array<Record<string, unknown>>,
  ) {}
}
