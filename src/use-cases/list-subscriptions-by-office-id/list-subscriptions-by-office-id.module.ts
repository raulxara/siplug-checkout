import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { ListSubscriptionsByOfficeIdController } from './list-subscriptions-by-office-id.controller';
import { ListSubscriptionsByOfficeIdUseCase } from './list-subscriptions-by-office-id.use-case';

@Module({
  imports: [GetAuthContextModule, SubscriptionsModule, SecurityModule],
  controllers: [ListSubscriptionsByOfficeIdController],
  providers: [ListSubscriptionsByOfficeIdUseCase],
  exports: [ListSubscriptionsByOfficeIdUseCase],
})
export class ListSubscriptionsByOfficeIdModule {}
