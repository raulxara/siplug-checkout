import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { ListSubscriptionInvoicesController } from './list-subscription-invoices.controller';
import { ListSubscriptionInvoicesUseCase } from './list-subscription-invoices.use-case';

@Module({
  imports: [SubscriptionInvoicesModule, SecurityModule],
  controllers: [ListSubscriptionInvoicesController],
  providers: [ListSubscriptionInvoicesUseCase],
  exports: [ListSubscriptionInvoicesUseCase],
})
export class ListSubscriptionInvoicesModule {}
