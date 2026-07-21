export class GetAllSubscriptionPlansByOfficeIdDtoOut {
  constructor(
    public readonly subscriptionPlans: Array<Record<string, unknown>>,
  ) {}
}
