import { Module } from '@nestjs/common';

import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { UseCaseSupportModule } from '../../common/services/use-case-support/use-case-support.module';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { PaymentWebhookEventsModule } from '../../modules/payment-webhook-events/payment-webhook-events.module';
import { ProcessPaymentWebhookEventModule } from '../process-payment-webhook-event/process-payment-webhook-event.module';
import { CapturePayPalOrderReturnController } from './capture-paypal-order-return.controller';
import { CapturePayPalOrderReturnUseCase } from './capture-paypal-order-return.use-case';
import { PaymentTransactionsModule } from '../../modules/payment-transactions/payment-transactions.module';


@Module({
  imports: [
    UseCaseSupportModule,
    ApiCredentialsModule,
    PaymentWebhookEventsModule,
    ProcessPaymentWebhookEventModule,
    PaymentTransactionsModule,
  ],
  controllers: [CapturePayPalOrderReturnController],
  providers: [
    DecryptApiCredentialSecretService,
    CapturePayPalOrderReturnUseCase,
  ],
  exports: [CapturePayPalOrderReturnUseCase],
})
export class CapturePayPalOrderReturnModule {}
