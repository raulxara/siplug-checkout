export class ListSubscriptionPlansDtoOut {
  constructor(
    public readonly subscriptionPlans: Array<Record<string, unknown>>,
  ) {}
}