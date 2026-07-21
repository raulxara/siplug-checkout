import type { SubscriptionPlanRow } from '../../../modules/subscription-plans/entities/subscription-plans-repository.interface';

export class RegisterSubscriptionPlanDtoOut {
  constructor(
    public readonly subscriptionPlan: SubscriptionPlanRow,
  ) {}
}