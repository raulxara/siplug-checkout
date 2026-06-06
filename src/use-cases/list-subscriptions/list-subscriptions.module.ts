import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { ListSubscriptionsController } from './list-subscriptions.controller';
import { ListSubscriptionsUseCase } from './list-subscriptions.use-case';

@Module({
  imports: [SubscriptionsModule, SecurityModule],
  controllers: [ListSubscriptionsController],
  providers: [ListSubscriptionsUseCase],
  exports: [ListSubscriptionsUseCase],
})
export class ListSubscriptionsModule {}
