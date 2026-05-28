import { Module } from '@nestjs/common';

import { CieloGatewayPaymentProvider } from './providers/cielo/cielo-gateway-payment.provider';
import { EfiBankGatewayPaymentProvider } from './providers/efi-bank/efi-bank-gateway-payment.provider';
import { GetnetGatewayPaymentProvider } from './providers/getnet/getnet-gateway-payment.provider';
import { InfinityPayGatewayPaymentProvider } from './providers/infinity-pay/infinity-pay-gateway-payment.provider';
import { IuguGatewayPaymentProvider } from './providers/iugu/iugu-gateway-payment.provider';
import { MercadoPagoGatewayPaymentProvider } from './providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagarmeGatewayPaymentProvider } from './providers/pagarme/pagarme-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from './providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from './providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from './providers/stripe/stripe-gateway-payment.provider';
import { VindiGatewayPaymentProvider } from './providers/vindi/vindi-gateway-payment.provider';

import { DispatchGatewayPaymentService } from './services/dispatch-gateway-payment/dispatch-gateway-payment.service';
import { FetchMercadoPagoPaymentService } from './services/fetch-mercado-pago-payment/fetch-mercado-pago-payment.service';
import { ResolveGatewayPaymentProviderService } from './services/resolve-gateway-payment-provider/resolve-gateway-payment-provider.service';
import { ApiCredentialsModule } from '../api-credentials/api-credentials.module';
import { GatewaysModule } from '../gateways/gateways.module';
import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { ResolvePaymentGatewayCredentialService } from './services/resolve-payment-gateway-credential/resolve-payment-gateway-credential.service';

@Module({
  imports: [ApiCredentialsModule, GatewaysModule],
  providers: [
    MercadoPagoGatewayPaymentProvider,
    StripeGatewayPaymentProvider,
    PagSeguroGatewayPaymentProvider,
    VindiGatewayPaymentProvider,
    PagarmeGatewayPaymentProvider,
    PayPalGatewayPaymentProvider,
    CieloGatewayPaymentProvider,
    GetnetGatewayPaymentProvider,
    IuguGatewayPaymentProvider,
    EfiBankGatewayPaymentProvider,
    InfinityPayGatewayPaymentProvider,

    ResolveGatewayPaymentProviderService,
    DispatchGatewayPaymentService,
    FetchMercadoPagoPaymentService,
    ResolvePaymentGatewayCredentialService,
    DecryptApiCredentialSecretService,
  ],
  exports: [
    ResolveGatewayPaymentProviderService,
    DispatchGatewayPaymentService,
    FetchMercadoPagoPaymentService,
    ResolvePaymentGatewayCredentialService,
  ],
})
export class GatewayOrchestrationModule {}
