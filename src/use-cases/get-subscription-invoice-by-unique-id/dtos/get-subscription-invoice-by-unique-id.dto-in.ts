export class GetSubscriptionInvoiceByUniqueIdDtoIn {
  public readonly token: string;
  public readonly subscriptionInvoiceId: string;

  constructor(params: { token?: unknown; subscriptionInvoiceId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionInvoiceId = String(
      params.subscriptionInvoiceId ?? '',
    ).trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionInvoiceId === '') {
      throw new Error('subscriptionInvoiceId is required');
    }
  }
}
