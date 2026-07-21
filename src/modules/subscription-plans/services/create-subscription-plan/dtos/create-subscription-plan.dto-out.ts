import type { SubscriptionPlanRow } from '../../../entities/subscription-plans-repository.interface';

export class CreateSubscriptionPlanDtoOut {
  constructor(
    public readonly subscriptionPlan: SubscriptionPlanRow,
  ) {}
}