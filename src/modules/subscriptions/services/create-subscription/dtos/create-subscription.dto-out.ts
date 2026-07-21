import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';

export class CreateSubscriptionDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
  ) {}
}