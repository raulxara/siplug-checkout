import { Module } from '@nestjs/common';
import { SubscriptionInvoicesRepository } from './repositories/subscription-invoices.repository';
import { CreateSubscriptionInvoiceService } from './services/create-subscription-invoice/create-subscription-invoice.service';
import { FindSubscriptionInvoiceByUniqueIdService } from './services/find-subscription-invoice-by-unique-id/find-subscription-invoice-by-unique-id.service';
import { UpdateSubscriptionInvoiceService } from './services/update-subscription-invoice/update-subscription-invoice.service';
import { SUBSCRIPTION_INVOICES_REPOSITORY } from './tokens/subscription-invoices.tokens';
import { GetAllSubscriptionInvoicesService } from './services/get-all-subscription-invoices/get-all-subscription-invoices.service';
import { GetAllSubscriptionInvoicesByOfficeIdService } from './services/get-all-subscription-invoices-by-office-id/get-all-subscription-invoices-by-office-id.service';

@Module({
  providers: [
    {
      provide: SUBSCRIPTION_INVOICES_REPOSITORY,
      useClass: SubscriptionInvoicesRepository,
    },
    CreateSubscriptionInvoiceService,
    FindSubscriptionInvoiceByUniqueIdService,
    UpdateSubscriptionInvoiceService,
    GetAllSubscriptionInvoicesService,
    GetAllSubscriptionInvoicesByOfficeIdService,
  ],
  exports: [
    SUBSCRIPTION_INVOICES_REPOSITORY,
    CreateSubscriptionInvoiceService,
    FindSubscriptionInvoiceByUniqueIdService,
    UpdateSubscriptionInvoiceService,
    GetAllSubscriptionInvoicesService,
    GetAllSubscriptionInvoicesByOfficeIdService,
  ],
})
export class SubscriptionInvoicesModule {}
