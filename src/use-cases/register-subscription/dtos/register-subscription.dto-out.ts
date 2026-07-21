import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';

export class RegisterSubscriptionDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow,
  ) {}
}