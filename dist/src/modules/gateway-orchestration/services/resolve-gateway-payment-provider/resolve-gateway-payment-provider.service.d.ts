import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { InfinityPayGatewayPaymentProvider } from '../../providers/infinity-pay/infinity-pay-gateway-payment.provider';
import { MercadoPagoGatewayPaymentProvider } from '../../providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from '../../providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from '../../providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from '../../providers/stripe/stripe-gateway-payment.provider';
import { PicPayGatewayPaymentProvider } from '../../providers/picpay/picpay-gateway-payment.provider';
export declare class ResolveGatewayPaymentProviderService {
    private readonly mercadoPagoGatewayPaymentProvider;
    private readonly stripeGatewayPaymentProvider;
    private readonly pagSeguroGatewayPaymentProvider;
    private readonly paypalGatewayPaymentProvider;
    private readonly infinityPayGatewayPaymentProvider;
    private readonly picPayGatewayPaymentProvider;
    constructor(mercadoPagoGatewayPaymentProvider: MercadoPagoGatewayPaymentProvider, stripeGatewayPaymentProvider: StripeGatewayPaymentProvider, pagSeguroGatewayPaymentProvider: PagSeguroGatewayPaymentProvider, paypalGatewayPaymentProvider: PayPalGatewayPaymentProvider, infinityPayGatewayPaymentProvider: InfinityPayGatewayPaymentProvider, picPayGatewayPaymentProvider: PicPayGatewayPaymentProvider);
    exec(gatewayProvider: string): IGatewayPaymentProvider;
}
