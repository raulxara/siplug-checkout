import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';

export class FindSubscriptionPlanBySlugAndOfficeIdDtoOut {
  constructor(
    public readonly subscriptionPlan: SubscriptionPlanRow | null,
  ) {}
}