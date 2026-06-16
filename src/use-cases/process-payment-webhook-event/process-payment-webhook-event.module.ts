import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { ProcessPaymentWebhookEventUseCase } from './process-payment-webhook-event.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    PaymentWebhookEventsModule,
    PaymentTransactionsModule,
  ],
  providers: [ProcessPaymentWebhookEventUseCase],
  exports: [ProcessPaymentWebhookEventUseCase],
})
export class ProcessPaymentWebhookEventModule {}
