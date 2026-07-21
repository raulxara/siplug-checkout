export class GetSubscriptionPlanByUniqueIdDtoIn {
  public readonly token: string;
  public readonly subscriptionPlanId: string;

  constructor(params: { token?: unknown; subscriptionPlanId?: unknown }) {
    this.token = String(params.token ?? '').trim();
    this.subscriptionPlanId = String(params.subscriptionPlanId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.subscriptionPlanId === '') {
      throw new Error('subscriptionPlanId is required');
    }
  }
}
