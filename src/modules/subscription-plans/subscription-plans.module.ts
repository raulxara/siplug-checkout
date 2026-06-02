import { Module } from '@nestjs/common';
import { SubscriptionPlansRepository } from './repositories/subscription-plans.repository';
import { CreateSubscriptionPlanService } from './services/create-subscription-plan/create-subscription-plan.service';
import { FindSubscriptionPlanBySlugAndOfficeIdService } from './services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service';
import { FindSubscriptionPlanByUniqueIdService } from './services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { SUBSCRIPTION_PLANS_REPOSITORY } from './tokens/subscription-plans.tokens';

@Module({
  providers: [
    {
      provide: SUBSCRIPTION_PLANS_REPOSITORY,
      useClass: SubscriptionPlansRepository,
    },
    CreateSubscriptionPlanService,
    FindSubscriptionPlanByUniqueIdService,
    FindSubscriptionPlanBySlugAndOfficeIdService,
  ],
  exports: [
    SUBSCRIPTION_PLANS_REPOSITORY,
    CreateSubscriptionPlanService,
    FindSubscriptionPlanByUniqueIdService,
    FindSubscriptionPlanBySlugAndOfficeIdService,
  ],
})
export class SubscriptionPlansModule {}
