import { Module } from '@nestjs/common';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { CheckoutSessionsModule } from '../../modules/checkout-sessions/checkout-sessions.module';
import { GatewayOrchestrationModule } from '../../modules/gateway-orchestration/gateway-orchestration.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { SecurityModule } from '../../modules/security/security.module';
import { SubscriptionCyclesModule } from '../../modules/subscription-cycles/subscription-cycles.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { SubscriptionPlansModule } from '../../modules/subscription-plans/subscription-plans.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { ProcessRecurringPaymentController } from './process-recurring-payment.controller';
import { ProcessRecurringPaymentUseCase } from './process-recurring-payment.use-case';
import { PaymentCustomersModule } from '../../modules/payment-customers/payment-customers.module';
import { PaymentSplitRecipientsModule } from '../../modules/payment-split-recipients/payment-split-recipients.module';
import { PaymentSplitsModule } from '../../modules/payment-splits/payment-splits.module';
import { SplitCalculationsModule } from '../../modules/split-calculations/split-calculations.module';

@Module({
  imports: [
    CheckoutSessionsModule,
    PaymentCustomersModule,
    SubscriptionPlansModule,
    SubscriptionsModule,
    SubscriptionCyclesModule,
    SubscriptionInvoicesModule,
    PaymentTransactionsModule,
    PaymentSplitsModule,
    PaymentSplitRecipientsModule,
    SplitCalculationsModule,
    GatewayOrchestrationModule,
    SecurityModule,
    UseCaseSupportModule,
  ],
  controllers: [ProcessRecurringPaymentController],
  providers: [ProcessRecurringPaymentUseCase],
  exports: [ProcessRecurringPaymentUseCase],
})
export class ProcessRecurringPaymentModule {}
