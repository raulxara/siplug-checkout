import { Module } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { SubscriptionCyclesModule } from '../../modules/subscription-cycles/subscription-cycles.module';
import { SubscriptionInvoicesModule } from '../../modules/subscription-invoices/subscription-invoices.module';
import { SubscriptionsModule } from '../../modules/subscriptions/subscriptions.module';
import { ProcessSubscriptionWebhookEventUseCase } from './process-subscription-webhook-event.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    PaymentWebhookEventsModule,
    SubscriptionsModule,
    SubscriptionCyclesModule,
    SubscriptionInvoicesModule,
  ],
  providers: [
    BuildChangesHistoryService,
    ProcessSubscriptionWebhookEventUseCase,
  ],
  exports: [ProcessSubscriptionWebhookEventUseCase],
})
export class ProcessSubscriptionWebhookEventModule {}