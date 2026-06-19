import { Module } from '@nestjs/common';

import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { PaymentWebhookGatewaysModule } from '../../modules/payment-webhook-gateways/payment-webhook-gateways.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { ReceivePicPayWebhookController } from './receive-picpay-webhook.controller';
import { ReceivePicPayWebhookUseCase } from './receive-picpay-webhook.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentWebhookGatewaysModule,
    PaymentWebhookEventsModule,
    PaymentTransactionsModule,
    ProcessPaymentWebhookEventModule,
  ],
  controllers: [ReceivePicPayWebhookController],
  providers: [DecryptApiCredentialSecretService, ReceivePicPayWebhookUseCase],
  exports: [ReceivePicPayWebhookUseCase],
})
export class ReceivePicPayWebhookModule {}
