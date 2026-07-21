import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';

export class UpdateSubscriptionDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
  ) {}
}