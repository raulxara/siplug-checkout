export class GetSubscriptionByUniqueIdDtoIn {
  public readonly token: string;
  public readonly subscriptionId: string;

  constructor(params: { token?: unknown; subscriptionId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionId = String(params.subscriptionId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionId === '') {
      throw new Error('subscriptionId is required');
    }
  }
}
