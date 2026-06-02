import { Module } from '@nestjs/common';
import { SubscriptionInvoicesRepository } from './repositories/subscription-invoices.repository';
import { CreateSubscriptionInvoiceService } from './services/create-subscription-invoice/create-subscription-invoice.service';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from './tokens/subscription-invoices.tokens';

@Module({
  providers: [
    {
      provide: SUBSCRIPTION_INVOICES_REPOSITORY,
      useClass: SubscriptionInvoicesRepository,
    },
    CreateSubscriptionInvoiceService,
  ],
  exports: [
    SUBSCRIPTION_INVOICES_REPOSITORY,
    CreateSubscriptionInvoiceService,
  ],
})
export class SubscriptionInvoicesModule {}