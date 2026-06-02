import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';

export class FindSubscriptionPlanByUniqueIdDtoOut {
  constructor(
    public readonly subscriptionPlan: SubscriptionPlanRow,
  ) {}
}
