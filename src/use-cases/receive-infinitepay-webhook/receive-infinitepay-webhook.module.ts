import { Module } from '@nestjs/common';

import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { PaymentWebhookGatewaysModule } from '../../modules/payment-webhook-gateways/payment-webhook-gateways.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { ReceiveInfinitePayWebhookController } from './receive-infinitepay-webhook.controller';
import { ReceiveInfinitePayWebhookUseCase } from './receive-infinitepay-webhook.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    PaymentWebhookGatewaysModule,
    PaymentWebhookEventsModule,
    PaymentTransactionsModule,
    ProcessPaymentWebhookEventModule,
  ],
  controllers: [ReceiveInfinitePayWebhookController],
  providers: [ReceiveInfinitePayWebhookUseCase],
  exports: [ReceiveInfinitePayWebhookUseCase],
})
export class ReceiveInfinitePayWebhookModule {}
