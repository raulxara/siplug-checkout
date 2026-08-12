import { Module } from '@nestjs/common';

import { ReceiveMercadoPagoWebhookModule } from '../receive-mercado-pago-webhook/receive-mercado-pago-webhook.module';
import { SimulateMercadoPagoPaymentWebhookController } from './simulate-mercado-pago-payment-webhook.controller';
import { SimulateMercadoPagoPaymentWebhookUseCase } from './simulate-mercado-pago-payment-webhook.use-case';

@Module({
  imports: [ReceiveMercadoPagoWebhookModule],
  controllers: [SimulateMercadoPagoPaymentWebhookController],
  providers: [SimulateMercadoPagoPaymentWebhookUseCase],
  exports: [SimulateMercadoPagoPaymentWebhookUseCase],
})
export class SimulateMercadoPagoPaymentWebhookModule {}