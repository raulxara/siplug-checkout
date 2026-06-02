import { Injectable } from '@nestjs/common';
import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { InfinityPayGatewayPaymentProvider } from '../../providers/infinity-pay/infinity-pay-gateway-payment.provider';
import { MercadoPagoGatewayPaymentProvider } from '../../providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from '../../providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from '../../providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from '../../providers/stripe/stripe-gateway-payment.provider';
import { PicPayGatewayPaymentProvider } from '../../providers/picpay/picpay-gateway-payment.provider';

@Injectable()
export class ResolveGatewayPaymentProviderService {
  constructor(
    private readonly mercadoPagoGatewayPaymentProvider: MercadoPagoGatewayPaymentProvider,
    private readonly stripeGatewayPaymentProvider: StripeGatewayPaymentProvider,
    private readonly pagSeguroGatewayPaymentProvider: PagSeguroGatewayPaymentProvider,
    private readonly paypalGatewayPaymentProvider: PayPalGatewayPaymentProvider,
    private readonly infinityPayGatewayPaymentProvider: InfinityPayGatewayPaymentProvider,
    private readonly picPayGatewayPaymentProvider: PicPayGatewayPaymentProvider,
  ) {}

  exec(gatewayProvider: string): IGatewayPaymentProvider {
    const providers: IGatewayPaymentProvider[] = [
      this.mercadoPagoGatewayPaymentProvider,
      this.stripeGatewayPaymentProvider,
      this.pagSeguroGatewayPaymentProvider,
      this.paypalGatewayPaymentProvider,
      this.infinityPayGatewayPaymentProvider,
      this.picPayGatewayPaymentProvider,
    ];

    const provider = providers.find((item) => item.supports(gatewayProvider));

    if (!provider) {
      throw new Error(`gateway provider not supported: ${gatewayProvider}`);
    }

    return provider;
  }
}
