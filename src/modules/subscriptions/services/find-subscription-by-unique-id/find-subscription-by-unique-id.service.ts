import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionsRepository } from '../../entities/subscriptions-repository.interface';
import { SUBSCRIPTIONS_REPOSITORY } from '../../tokens/subscriptions.tokens';
import { FindSubscriptionByUniqueIdDtoIn } from './dtos/find-subscription-by-unique-id.dto-in';
import { FindSubscriptionByUniqueIdDtoOut } from './dtos/find-subscription-by-unique-id.dto-out';

@Injectable()
export class FindSubscriptionByUniqueIdService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY)
    private readonly repository: ISubscriptionsRepository,
  ) {}

  async exec(
    dtoIn: FindSubscriptionByUniqueIdDtoIn,
  ): Promise<FindSubscriptionByUniqueIdDtoOut> {
    try {
      const row = await this.repository.findByUniqueId(dtoIn.subscriptionId);

      if (!row) {
        throw new Error('subscription not found');
      }

      return new FindSubscriptionByUniqueIdDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find subscription by unique id';

      throw new Error(message);
    }
  }
}