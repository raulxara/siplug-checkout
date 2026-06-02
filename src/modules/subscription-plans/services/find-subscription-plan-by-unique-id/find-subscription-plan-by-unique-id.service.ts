import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { FindSubscriptionPlanByUniqueIdDtoIn } from './dtos/find-subscription-plan-by-unique-id.dto-in';
import { FindSubscriptionPlanByUniqueIdDtoOut } from './dtos/find-subscription-plan-by-unique-id.dto-out';

@Injectable()
export class FindSubscriptionPlanByUniqueIdService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly repository: ISubscriptionPlansRepository,
  ) {}

  async exec(
    dtoIn: FindSubscriptionPlanByUniqueIdDtoIn,
  ): Promise<FindSubscriptionPlanByUniqueIdDtoOut> {
    try {
      const row = await this.repository.findByUniqueId(
        dtoIn.subscriptionPlanId,
      );

      if (!row) {
        throw new Error('subscription plan not found');
      }

      return new FindSubscriptionPlanByUniqueIdDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find subscription plan by unique id';

      throw new Error(message);
    }
  }
}
