import { Module } from '@nestjs/common';

import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { PaymentWebhookGatewaysModule } from '../../modules/payment-webhook-gateways/payment-webhook-gateways.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { CapturePayPalOrderReturnModule } from '../capture-paypal-order-return/capture-paypal-order-return.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { ProcessSubscriptionWebhookEventModule } from '../process-subscription-webhook-event/process-subscription-webhook-event.module';
import { ReceivePayPalWebhookController } from './receive-paypal-webhook.controller';
import { ReceivePayPalWebhookUseCase } from './receive-paypal-webhook.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentWebhookGatewaysModule,
    PaymentWebhookEventsModule,
    ProcessPaymentWebhookEventModule,
    ProcessSubscriptionWebhookEventModule,
    PaymentTransactionsModule,
    CapturePayPalOrderReturnModule,
  ],
  controllers: [ReceivePayPalWebhookController],
  providers: [DecryptApiCredentialSecretService, ReceivePayPalWebhookUseCase],
  exports: [ReceivePayPalWebhookUseCase],
})
export class ReceivePayPalWebhookModule {}