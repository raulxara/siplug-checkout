import { Module } from '@nestjs/common';
import { SubscriptionInvoicesRepository } from './repositories/subscription-invoices.repository';
import { CreateSubscriptionInvoiceService } from './services/create-subscription-invoice/create-subscription-invoice.service';
import { FindSubscriptionInvoiceByUniqueIdService } from './services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { UpdateSubscriptionInvoiceService } from './services/update-subscription-invoice/update-subscription-invoice.service';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from './tokens/subscription-invoices.tokens';

@Module({
  providers: [
    {
      provide: SUBSCRIPTION_INVOICES_REPOSITORY,
      useClass: SubscriptionInvoicesRepository,
    },
    CreateSubscriptionInvoiceService,
    FindSubscriptionInvoiceByUniqueIdService,
    UpdateSubscriptionInvoiceService,
  ],
  exports: [
    SUBSCRIPTION_INVOICES_REPOSITORY,
    CreateSubscriptionInvoiceService,
    FindSubscriptionInvoiceByUniqueIdService,
    UpdateSubscriptionInvoiceService,
  ],
})
export class SubscriptionInvoicesModule {}
