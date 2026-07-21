export class FindSubscriptionInvoiceByUniqueIdDtoIn {
  public readonly subscriptionInvoiceId: string;

  constructor(subscriptionInvoiceId: string) {
    if (!subscriptionInvoiceId || subscriptionInvoiceId.trim() === '') {
      throw new Error('subscriptionInvoiceId is required');
    }

    this.subscriptionInvoiceId = subscriptionInvoiceId.trim();
  }
}
