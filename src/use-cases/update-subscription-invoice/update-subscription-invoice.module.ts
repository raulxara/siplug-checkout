import { Module } from '@nestjs/common';

import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { UpdateSubscriptionInvoiceController } from './update-subscription-invoice.controller';
import { UpdateSubscriptionInvoiceUseCase } from './update-subscription-invoice.use-case';

@Module({
  imports: [SubscriptionInvoicesModule, SecurityModule],
  controllers: [UpdateSubscriptionInvoiceController],
  providers: [UpdateSubscriptionInvoiceUseCase],
  exports: [UpdateSubscriptionInvoiceUseCase],
})
export class UpdateSubscriptionInvoiceModule {}
