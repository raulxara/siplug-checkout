import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { MercadoPagoGatewayPaymentProvider } from '../../providers/mercado-pago/mercado-pago-gateway-payment.provider';
import { PagSeguroGatewayPaymentProvider } from '../../providers/pagseguro/pagseguro-gateway-payment.provider';
import { PayPalGatewayPaymentProvider } from '../../providers/paypal/paypal-gateway-payment.provider';
import { StripeGatewayPaymentProvider } from '../../providers/stripe/stripe-gateway-payment.provider';
export declare class ResolveGatewayPaymentProviderService {
    private readonly mercadoPagoGatewayPaymentProvider;
    private readonly stripeGatewayPaymentProvider;
    private readonly pagSeguroGatewayPaymentProvider;
    private readonly paypalGatewayPaymentProvider;
    constructor(mercadoPagoGatewayPaymentProvider: MercadoPagoGatewayPaymentProvider, stripeGatewayPaymentProvider: StripeGatewayPaymentProvider, pagSeguroGatewayPaymentProvider: PagSeguroGatewayPaymentProvider, paypalGatewayPaymentProvider: PayPalGatewayPaymentProvider);
    exec(gatewayProvider: string): IGatewayPaymentProvider;
}
