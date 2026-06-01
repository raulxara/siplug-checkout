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
import { PicPayGatewayPaymentProvider } from '../../providers/picpay/picpay-gateway-payment.provider';
export declare class ResolveGatewayPaymentProviderService {
    private readonly mercadoPagoGatewayPaymentProvider;
    private readonly stripeGatewayPaymentProvider;
    private readonly pagSeguroGatewayPaymentProvider;
    private readonly vindiGatewayPaymentProvider;
    private readonly pagarmeGatewayPaymentProvider;
    private readonly paypalGatewayPaymentProvider;
    private readonly cieloGatewayPaymentProvider;
    private readonly getnetGatewayPaymentProvider;
    private readonly iuguGatewayPaymentProvider;
    private readonly efiBankGatewayPaymentProvider;
    private readonly infinityPayGatewayPaymentProvider;
    private readonly picPayGatewayPaymentProvider;
    constructor(mercadoPagoGatewayPaymentProvider: MercadoPagoGatewayPaymentProvider, stripeGatewayPaymentProvider: StripeGatewayPaymentProvider, pagSeguroGatewayPaymentProvider: PagSeguroGatewayPaymentProvider, vindiGatewayPaymentProvider: VindiGatewayPaymentProvider, pagarmeGatewayPaymentProvider: PagarmeGatewayPaymentProvider, paypalGatewayPaymentProvider: PayPalGatewayPaymentProvider, cieloGatewayPaymentProvider: CieloGatewayPaymentProvider, getnetGatewayPaymentProvider: GetnetGatewayPaymentProvider, iuguGatewayPaymentProvider: IuguGatewayPaymentProvider, efiBankGatewayPaymentProvider: EfiBankGatewayPaymentProvider, infinityPayGatewayPaymentProvider: InfinityPayGatewayPaymentProvider, picPayGatewayPaymentProvider: PicPayGatewayPaymentProvider);
    exec(gatewayProvider: string): IGatewayPaymentProvider;
}
