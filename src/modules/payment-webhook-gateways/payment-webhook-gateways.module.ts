import { Module } from '@nestjs/common';

import { NormalizeStripeWebhookService } from './stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service';
import { ValidateStripeWebhookService } from './stripe/services/validate-stripe-webhook/validate-stripe-webhook.service';

@Module({
  providers: [ValidateStripeWebhookService, NormalizeStripeWebhookService],
  exports: [ValidateStripeWebhookService, NormalizeStripeWebhookService],
})
export class PaymentWebhookGatewaysModule {}
