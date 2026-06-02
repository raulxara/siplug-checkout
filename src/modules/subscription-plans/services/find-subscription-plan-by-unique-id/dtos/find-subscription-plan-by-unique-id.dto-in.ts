export class FindSubscriptionPlanByUniqueIdDtoIn {
  public readonly subscriptionPlanId: string;

  constructor(subscriptionPlanId: string) {
    if (!subscriptionPlanId || subscriptionPlanId.trim() === '') {
      throw new Error('subscriptionPlanId is required');
    }

    this.subscriptionPlanId = subscriptionPlanId.trim();
  }
}
