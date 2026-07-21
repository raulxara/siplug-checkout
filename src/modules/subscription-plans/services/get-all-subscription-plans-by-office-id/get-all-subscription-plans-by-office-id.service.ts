import { Inject, Injectable } from '@nestjs/common';

import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { GetAllSubscriptionPlansByOfficeIdDtoIn } from './dtos/get-all-subscription-plans-by-office-id.dto-in';
import { GetAllSubscriptionPlansByOfficeIdDtoOut } from './dtos/get-all-subscription-plans-by-office-id.dto-out';

@Injectable()
export class GetAllSubscriptionPlansByOfficeIdService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly subscriptionPlansRepository: ISubscriptionPlansRepository,
  ) {}

  async exec(
    dtoIn: GetAllSubscriptionPlansByOfficeIdDtoIn,
  ): Promise<GetAllSubscriptionPlansByOfficeIdDtoOut> {
    const subscriptionPlans =
      await this.subscriptionPlansRepository.getAllByOfficeId(dtoIn.officeId);

    return new GetAllSubscriptionPlansByOfficeIdDtoOut(
      subscriptionPlans as unknown as Array<Record<string, unknown>>,
    );
  }
}
