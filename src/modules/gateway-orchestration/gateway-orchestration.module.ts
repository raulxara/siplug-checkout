import { Module } from '@nestjs/common';

import { InfinityPayGatewayPaymentProvider } from './providers/infinity-pay/infinity-pay-gateway-payment.provider';
import { MercadoPagoGatewayPaymentProvider } from './providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from './providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from './providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from './providers/stripe/stripe-gateway-payment.provider';
import { DispatchGatewayPaymentService } from './services/dispatch-gateway-payment/dispatch-gateway-payment.service';
import { FetchMercadoPagoPaymentService } from './services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service';
import { ResolveGatewayPaymentProviderService } from './services/resolve-gateway-payment-provider/resolve-gateway-payment-provider.service';
import { ApiCredentialsModule } from '../api-credentials/api-credentials.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { ResolvePaymentGatewayCredentialService } from './services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';
import { PicPayGatewayPaymentProvider } from './providers/picpay/picpay-gateway-payment.provider';
import { SyncGatewayPaymentStatusService } from './services/sync-gateway-payment-status/sync-gateway-payment-status.service';
import { DispatchGatewayRecurringPaymentService } from './services/dispatch-gateway-recurring-payment/dispatch-gateway-recurring-payment.service';
import { MercadoPagoRecurringPaymentProvider } from './providers/mercado-pago/mercado-pago-recurring-payment.provider';
import { StripeRecurringPaymentProvider } from './providers/stripe/stripe-recurring-payment.provider';
import { PayPalRecurringPaymentProvider } from './providers/paypal/paypal-recurring-payment.provider';
import { PagSeguroRecurringPaymentProvider } from './providers/pagseguro/pagseguro-recurring-payment.provider';
import { PicPayRecurringPaymentProvider } from './providers/picpay/picpay-recurring-payment.provider';

@Module({
  imports: [ApiCredentialsModule, GatewaysModule],
  providers: [
    MercadoPagoGatewayPaymentProvider,
    StripeGatewayPaymentProvider,
    PagSeguroGatewayPaymentProvider,
    PayPalGatewayPaymentProvider,
    InfinityPayGatewayPaymentProvider,
    PicPayGatewayPaymentProvider,
    ResolveGatewayPaymentProviderService,
    DispatchGatewayPaymentService,
    FetchMercadoPagoPaymentService,
    ResolvePaymentGatewayCredentialService,
    DecryptApiCredentialSecretService,
    SyncGatewayPaymentStatusService,
    DispatchGatewayRecurringPaymentService,
    MercadoPagoRecurringPaymentProvider,
    StripeRecurringPaymentProvider,
    PayPalRecurringPaymentProvider,
    PagSeguroRecurringPaymentProvider,
    PicPayRecurringPaymentProvider,
  ],
  exports: [
    ResolveGatewayPaymentProviderService,
    DispatchGatewayPaymentService,
    FetchMercadoPagoPaymentService,
    ResolvePaymentGatewayCredentialService,
    SyncGatewayPaymentStatusService,
    DispatchGatewayRecurringPaymentService,
    MercadoPagoRecurringPaymentProvider,
    StripeRecurringPaymentProvider,
    PayPalRecurringPaymentProvider,
    PagSeguroRecurringPaymentProvider,
    PicPayRecurringPaymentProvider,
  ],
})
export class GatewayOrchestrationModule {}
