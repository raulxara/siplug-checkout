import { Module } from '@nestjs/common';

import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { PaymentWebhookGatewaysModule } from '../../modules/payment-webhook-gateways/payment-webhook-gateways.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { ReceiveMercadoPagoWebhookController } from './receive-mercado-pago-webhook.controller';
import { ReceiveMercadoPagoWebhookUseCase } from './receive-mercado-pago-webhook.use-case';

@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentWebhookGatewaysModule,
    PaymentWebhookEventsModule,
    ProcessPaymentWebhookEventModule,
  ],
  controllers: [ReceiveMercadoPagoWebhookController],
  providers: [
    DecryptApiCredentialSecretService,
    ReceiveMercadoPagoWebhookUseCase,
  ],
  exports: [ReceiveMercadoPagoWebhookUseCase],
})
export class ReceiveMercadoPagoWebhookModule {}
