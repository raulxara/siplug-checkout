import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { GetSubscriptionInvoiceByUniqueIdController } from './get-subscription-invoice-by-unique-id.controller';
import { GetSubscriptionInvoiceByUniqueIdUseCase } from './get-subscription-invoice-by-unique-id.use-case';

@Module({
  imports: [SubscriptionInvoicesModule, SecurityModule],
  controllers: [GetSubscriptionInvoiceByUniqueIdController],
  providers: [GetSubscriptionInvoiceByUniqueIdUseCase],
  exports: [GetSubscriptionInvoiceByUniqueIdUseCase],
})
export class GetSubscriptionInvoiceByUniqueIdModule {}
