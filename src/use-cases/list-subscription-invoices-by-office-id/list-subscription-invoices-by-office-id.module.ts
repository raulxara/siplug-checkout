import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { ListSubscriptionInvoicesByOfficeIdController } from './list-subscription-invoices-by-office-id.controller';
import { ListSubscriptionInvoicesByOfficeIdUseCase } from './list-subscription-invoices-by-office-id.use-case';

@Module({
  imports: [SubscriptionInvoicesModule, SecurityModule],
  controllers: [ListSubscriptionInvoicesByOfficeIdController],
  providers: [ListSubscriptionInvoicesByOfficeIdUseCase],
  exports: [ListSubscriptionInvoicesByOfficeIdUseCase],
})
export class ListSubscriptionInvoicesByOfficeIdModule {}
