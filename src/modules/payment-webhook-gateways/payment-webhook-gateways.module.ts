import { Module } from '@nestjs/common';

import { NormalizeStripeWebhookService } from './stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service';
import { ValidateStripeWebhookService } from './stripe/services/validate-stripe-webhook/validate-stripe-webhook.service';

import { GetMercadoPagoPaymentService } from './mercado-pago/services/get-mercado-pago-payment/get-mercado-pago-payment.service';
import { NormalizeMercadoPagoWebhookService } from './mercado-pago/services/normalize-mercado-pago-webhook/normalize-mercado-pago-webhook.service';
import { ValidateMercadoPagoWebhookService } from './mercado-pago/services/validate-mercado-pago-webhook/validate-mercado-pago-webhook.service';
import { NormalizePagSeguroWebhookService } from './pagseguro/services/normalize-pagseguro-webhook/normalize-pagseguro-webhook.service';
import { ValidatePagSeguroWebhookService } from './pagseguro/services/validate-pagseguro-webhook/validate-pagseguro-webhook.service';
import { NormalizePicPayWebhookService } from './picpay/services/normalize-picpay-webhook/normalize-picpay-webhook.service';
import { ValidatePicPayWebhookService } from './picpay/services/validate-picpay-webhook/validate-picpay-webhook.service';

@Module({
  providers: [
    ValidateStripeWebhookService,
    NormalizeStripeWebhookService,

    ValidateMercadoPagoWebhookService,
    GetMercadoPagoPaymentService,
    NormalizeMercadoPagoWebhookService,
    NormalizePagSeguroWebhookService,
    ValidatePagSeguroWebhookService,
    NormalizePicPayWebhookService,
    ValidatePicPayWebhookService,
  ],
  exports: [
    ValidateStripeWebhookService,
    NormalizeStripeWebhookService,

    ValidateMercadoPagoWebhookService,
    GetMercadoPagoPaymentService,
    NormalizeMercadoPagoWebhookService,
    NormalizePagSeguroWebhookService,
    ValidatePagSeguroWebhookService,
    NormalizePicPayWebhookService,
    ValidatePicPayWebhookService,
  ],
})
export class PaymentWebhookGatewaysModule {}
