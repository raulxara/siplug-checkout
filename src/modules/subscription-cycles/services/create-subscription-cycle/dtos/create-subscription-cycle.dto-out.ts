import type { SubscriptionCycleRow } from '../../../entities/subscription-cycles-repository.interface';

export class CreateSubscriptionCycleDtoOut {
  constructor(
    public readonly subscriptionCycle: SubscriptionCycleRow,
  ) {}
}