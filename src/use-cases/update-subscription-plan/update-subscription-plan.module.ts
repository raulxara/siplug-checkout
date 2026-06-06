import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { UpdateSubscriptionPlanController } from './update-subscription-plan.controller';
import { UpdateSubscriptionPlanUseCase } from './update-subscription-plan.use-case';

@Module({
  imports: [SubscriptionPlansModule, SecurityModule],
  controllers: [UpdateSubscriptionPlanController],
  providers: [UpdateSubscriptionPlanUseCase],
  exports: [UpdateSubscriptionPlanUseCase],
})
export class UpdateSubscriptionPlanModule {}