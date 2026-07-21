import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionPlansRepository } from '../../entities/subscription-plans-repository.interface';
import { SUBSCRIPTION_PLANS_REPOSITORY } from '../../tokens/subscription-plans.tokens';
import { FindSubscriptionPlanBySlugAndOfficeIdDtoIn } from './dtos/find-subscription-plan-by-slug-and-office-id.dto-in';
import { FindSubscriptionPlanBySlugAndOfficeIdDtoOut } from './dtos/find-subscription-plan-by-slug-and-office-id.dto-out';

@Injectable()
export class FindSubscriptionPlanBySlugAndOfficeIdService {
  constructor(
    @Inject(SUBSCRIPTION_PLANS_REPOSITORY)
    private readonly repository: ISubscriptionPlansRepository,
  ) {}

  async exec(
    dtoIn: FindSubscriptionPlanBySlugAndOfficeIdDtoIn,
  ): Promise<FindSubscriptionPlanBySlugAndOfficeIdDtoOut> {
    try {
      const row = await this.repository.findBySlugAndOfficeId({
        slug: dtoIn.slug,
        officeId: dtoIn.officeId,
      });

      return new FindSubscriptionPlanBySlugAndOfficeIdDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find subscription plan by slug and office id';

      throw new Error(message);
    }
  }
}
