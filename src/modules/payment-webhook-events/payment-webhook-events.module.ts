import { Module } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { PaymentWebhookEventsRepository } from './repositories/payment-webhook-events.repository';
import { PAYMENT_WEBHOOK_EVENTS_REPOSITORY } from './tokens/payment-webhook-events.tokens';
import { RegisterPaymentWebhookEventService } from './services/register-payment-webhook-event/register-payment-webhook-event.service';
import { MarkPaymentWebhookEventAsProcessedService } from './services/mark-payment-webhook-event-as-processed/mark-payment-webhook-event-as-processed.service';
import { MarkPaymentWebhookEventAsFailedService } from './services/mark-payment-webhook-event-as-failed/mark-payment-webhook-event-as-failed.service';
import { MarkPaymentWebhookEventAsProcessingService } from './services/mark-payment-webhook-event-as-processing/mark-payment-webhook-event-as-processing.service';

@Module({
  providers: [
    BuildChangesHistoryService,
    {
      provide: PAYMENT_WEBHOOK_EVENTS_REPOSITORY,
      useClass: PaymentWebhookEventsRepository,
    },
    RegisterPaymentWebhookEventService,
    MarkPaymentWebhookEventAsProcessedService,
    MarkPaymentWebhookEventAsFailedService,
    MarkPaymentWebhookEventAsProcessingService,
  ],
  exports: [
    PAYMENT_WEBHOOK_EVENTS_REPOSITORY,
    RegisterPaymentWebhookEventService,
    MarkPaymentWebhookEventAsProcessedService,
    MarkPaymentWebhookEventAsFailedService,
    MarkPaymentWebhookEventAsProcessingService,
  ],
})
export class PaymentWebhookEventsModule {}
