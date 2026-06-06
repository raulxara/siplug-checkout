import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { ListSubscriptionPlansController } from './list-subscription-plans.controller';
import { ListSubscriptionPlansUseCase } from './list-subscription-plans.use-case';

@Module({
  imports: [SubscriptionPlansModule, SecurityModule],
  controllers: [ListSubscriptionPlansController],
  providers: [ListSubscriptionPlansUseCase],
  exports: [ListSubscriptionPlansUseCase],
})
export class ListSubscriptionPlansModule {}
