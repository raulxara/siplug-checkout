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
import { ResolveGatewayPaymentProviderService } from './services/resolve-gateway-payment-provider/resolve-gateway-payment-provider.service';

@Module({
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
  ],
  exports: [
    ResolveGatewayPaymentProviderService,
    DispatchGatewayPaymentService,
  ],
})
export class GatewayOrchestrationModule {}
