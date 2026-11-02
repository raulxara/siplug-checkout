import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { ListSubscriptionPlansByOfficeIdController } from './list-subscription-plans-by-office-id.controller';
import { ListSubscriptionPlansByOfficeIdUseCase } from './list-subscription-plans-by-office-id.use-case';

@Module({
  imports: [GetAuthContextModule, SubscriptionPlansModule, SecurityModule],
  controllers: [ListSubscriptionPlansByOfficeIdController],
  providers: [ListSubscriptionPlansByOfficeIdUseCase],
  exports: [ListSubscriptionPlansByOfficeIdUseCase],
})
export class ListSubscriptionPlansByOfficeIdModule {}
