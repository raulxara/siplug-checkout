import { Module } from '@nestjs/common';
import { SubscriptionPlansRepository } from './repositories/subscription-plans.repository';
import { CreateSubscriptionPlanService } from './services/create-subscription-plan/create-subscription-plan.service';
import { FindSubscriptionPlanBySlugAndOfficeIdService } from './services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service';
import { FindSubscriptionPlanByUniqueIdService } from './services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { SUBSCRIPTION_PLANS_REPOSITORY } from './tokens/subscription-plans.tokens';
import { GetAllSubscriptionPlansService } from './services/get-all-subscription-plans/get-all-subscription-plans.service';
import { GetAllSubscriptionPlansByOfficeIdService } from './services/get-all-subscription-plans-by-office-id/get-all-subscription-plans-by-office-id.service';
import { UpdateSubscriptionPlanService } from './services/update-subscription-plan/update-subscription-plan.service';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
@Module({
  providers: [
    {
      provide: SUBSCRIPTION_PLANS_REPOSITORY,
      useClass: SubscriptionPlansRepository,
    },
    CreateSubscriptionPlanService,
    FindSubscriptionPlanByUniqueIdService,
    FindSubscriptionPlanBySlugAndOfficeIdService,
    GetAllSubscriptionPlansService,
    GetAllSubscriptionPlansByOfficeIdService,
    UpdateSubscriptionPlanService,
    BuildChangesHistoryService,
  ],
  exports: [
    SUBSCRIPTION_PLANS_REPOSITORY,
    CreateSubscriptionPlanService,
    FindSubscriptionPlanByUniqueIdService,
    FindSubscriptionPlanBySlugAndOfficeIdService,
    GetAllSubscriptionPlansService,
    GetAllSubscriptionPlansByOfficeIdService,
    UpdateSubscriptionPlanService,
  ],
})
export class SubscriptionPlansModule {}
