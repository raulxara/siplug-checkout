import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { GetSubscriptionByUniqueIdController } from './get-subscription-by-unique-id.controller';
import { GetSubscriptionByUniqueIdUseCase } from './get-subscription-by-unique-id.use-case';

@Module({
  imports: [SubscriptionsModule, SecurityModule],
  controllers: [GetSubscriptionByUniqueIdController],
  providers: [GetSubscriptionByUniqueIdUseCase],
  exports: [GetSubscriptionByUniqueIdUseCase],
})
export class GetSubscriptionByUniqueIdModule {}
