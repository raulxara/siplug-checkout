import { Module } from '@nestjs/common';

import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { PaymentWebhookGatewaysModule } from '../../modules/payment-webhook-gateways/payment-webhook-gateways.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { ReceiveStripeWebhookController } from './receive-stripe-webhook.controller';
import { ReceiveStripeWebhookUseCase } from './receive-stripe-webhook.use-case';
import { ProcessSubscriptionWebhookEventModule } from '../process-subscription-webhook-event/process-subscription-webhook-event.module';

@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentWebhookGatewaysModule,
    PaymentWebhookEventsModule,
    ProcessPaymentWebhookEventModule,
    ProcessSubscriptionWebhookEventModule,
  ],
  controllers: [ReceiveStripeWebhookController],
  providers: [
    DecryptApiCredentialSecretService,
    ReceiveStripeWebhookUseCase,
  ],
  exports: [ReceiveStripeWebhookUseCase],
})
export class ReceiveStripeWebhookModule {}
