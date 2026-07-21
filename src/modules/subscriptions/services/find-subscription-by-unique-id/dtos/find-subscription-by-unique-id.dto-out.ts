import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';

export class FindSubscriptionByUniqueIdDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
  ) {}
}