export class FindSubscriptionByUniqueIdDtoIn {
  public readonly subscriptionId: string;

  constructor(subscriptionId: string) {
    if (!subscriptionId || subscriptionId.trim() === '') {
      throw new Error('subscriptionId is required');
    }

    this.subscriptionId = subscriptionId.trim();
  }
}