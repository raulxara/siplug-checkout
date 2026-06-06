import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { UpdateSubscriptionController } from './update-subscription.controller';
import { UpdateSubscriptionUseCase } from './update-subscription.use-case';

@Module({
  imports: [SubscriptionsModule, SecurityModule],
  controllers: [UpdateSubscriptionController],
  providers: [UpdateSubscriptionUseCase],
  exports: [UpdateSubscriptionUseCase],
})
export class UpdateSubscriptionModule {}
