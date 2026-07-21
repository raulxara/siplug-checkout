export class GetAllSubscriptionPlansDtoOut {
  constructor(
    public readonly subscriptionPlans: Array<Record<string, unknown>>,
  ) {}
}