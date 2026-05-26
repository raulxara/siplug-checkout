import { Injectable } from '@nestjs/common';
import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';

import { CieloGatewayPaymentProvider } from '../../providers/cielo/cielo-gateway-payment.provider';
import { EfiBankGatewayPaymentProvider } from '../../providers/efi-bank/efi-bank-gateway-payment.provider';
import { GetnetGatewayPaymentProvider } from '../../providers/getnet/getnet-gateway-payment.provider';
import { InfinityPayGatewayPaymentProvider } from '../../providers/infinity-pay/infinity-pay-gateway-payment.provider';
import { IuguGatewayPaymentProvider } from '../../providers/iugu/iugu-gateway-payment.provider';
import { MercadoPagoGatewayPaymentProvider } from '../../providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagarmeGatewayPaymentProvider } from '../../providers/pagarme/pagarme-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from '../../providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from '../../providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from '../../providers/stripe/stripe-gateway-payment.provider';
import { VindiGatewayPaymentProvider } from '../../providers/vindi/vindi-gateway-payment.provider';

@Injectable()
export class ResolveGatewayPaymentProviderService {
  constructor(
    private readonly mercadoPagoGatewayPaymentProvider: MercadoPagoGatewayPaymentProvider,
    private readonly stripeGatewayPaymentProvider: StripeGatewayPaymentProvider,
    private readonly pagSeguroGatewayPaymentProvider: PagSeguroGatewayPaymentProvider,
    private readonly vindiGatewayPaymentProvider: VindiGatewayPaymentProvider,
    private readonly pagarmeGatewayPaymentProvider: PagarmeGatewayPaymentProvider,
    private readonly paypalGatewayPaymentProvider: PayPalGatewayPaymentProvider,
    private readonly cieloGatewayPaymentProvider: CieloGatewayPaymentProvider,
    private readonly getnetGatewayPaymentProvider: GetnetGatewayPaymentProvider,
    private readonly iuguGatewayPaymentProvider: IuguGatewayPaymentProvider,
    private readonly efiBankGatewayPaymentProvider: EfiBankGatewayPaymentProvider,
    private readonly infinityPayGatewayPaymentProvider: InfinityPayGatewayPaymentProvider,
  ) {}

  exec(gatewayProvider: string): IGatewayPaymentProvider {
    const providers: IGatewayPaymentProvider[] = [
      this.mercadoPagoGatewayPaymentProvider,
      this.stripeGatewayPaymentProvider,
      this.pagSeguroGatewayPaymentProvider,
      this.vindiGatewayPaymentProvider,
      this.pagarmeGatewayPaymentProvider,
      this.paypalGatewayPaymentProvider,
      this.cieloGatewayPaymentProvider,
      this.getnetGatewayPaymentProvider,
      this.iuguGatewayPaymentProvider,
      this.efiBankGatewayPaymentProvider,
      this.infinityPayGatewayPaymentProvider,
    ];

    const provider = providers.find((item) => item.supports(gatewayProvider));

    if (!provider) {
      throw new Error(`gateway provider not supported: ${gatewayProvider}`);
    }

    return provider;
  }
}
