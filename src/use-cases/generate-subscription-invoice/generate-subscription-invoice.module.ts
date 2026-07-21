import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionCyclesModule } from '../../modules/subscription-cycles/subscription-cycles.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { GenerateSubscriptionInvoiceController } from './generate-subscription-invoice.controller';
import { GenerateSubscriptionInvoiceUseCase } from './generate-subscription-invoice.use-case';

@Module({
  imports: [
    SubscriptionsModule,
    SubscriptionPlansModule,
    SubscriptionCyclesModule,
    SubscriptionInvoicesModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [GenerateSubscriptionInvoiceController],
  providers: [GenerateSubscriptionInvoiceUseCase],
  exports: [GenerateSubscriptionInvoiceUseCase],
})
export class GenerateSubscriptionInvoiceModule {}