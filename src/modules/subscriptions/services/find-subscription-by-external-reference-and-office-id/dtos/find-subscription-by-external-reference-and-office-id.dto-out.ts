import type { SubscriptionRow } from '../../../entities/subscriptions-repository.interface';

export class FindSubscriptionByExternalReferenceAndOfficeIdDtoOut {
  constructor(
    public readonly subscription: SubscriptionRow | null,
  ) {}
}