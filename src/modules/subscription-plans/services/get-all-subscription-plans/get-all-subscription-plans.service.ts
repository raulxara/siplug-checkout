import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { GetAllSubscriptionPlansDtoOut } from './dtos/get-all-subscription-plans.dto-out';

@Injectable()
export class GetAllSubscriptionPlansService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: ISubscriptionPlansRepository,
  ) {}

  async exec(): Promise<GetAllSubscriptionPlansDtoOut> {
    const subscriptionPlans = await this.subscriptionPlansRepository.getAll();

    return new GetAllSubscriptionPlansDtoOut(
      subscriptionPlans as unknown as Array<Record<string, unknown>>,
    );
  }
}
