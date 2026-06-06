import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { GetSubscriptionPlanByUniqueIdController } from './get-subscription-plan-by-unique-id.controller';
import { GetSubscriptionPlanByUniqueIdUseCase } from './get-subscription-plan-by-unique-id.use-case';

@Module({
  imports: [SubscriptionPlansModule, SecurityModule],
  controllers: [GetSubscriptionPlanByUniqueIdController],
  providers: [GetSubscriptionPlanByUniqueIdUseCase],
  exports: [GetSubscriptionPlanByUniqueIdUseCase],
})
export class GetSubscriptionPlanByUniqueIdModule {}
