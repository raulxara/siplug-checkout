import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';
import { MercadoPagoRecurringPaymentProvider } from '../../providers/mercado-pago/mercado-pago-recurring-payment.provider';
import { StripeRecurringPaymentProvider } from '../../providers/stripe/stripe-recurring-payment.provider';
import { PayPalRecurringPaymentProvider } from '../../providers/paypal/paypal-recurring-payment.provider';
import { PagSeguroRecurringPaymentProvider } from '../../providers/pagseguro/pagseguro-recurring-payment.provider';
import { PicPayRecurringPaymentProvider } from '../../providers/picpay/picpay-recurring-payment.provider';
export declare class DispatchGatewayRecurringPaymentService {
    private readonly mercadoPagoRecurringPaymentProvider;
    private readonly stripeRecurringPaymentProvider;
    private readonly payPalRecurringPaymentProvider;
    private readonly pagSeguroRecurringPaymentProvider;
    private readonly picPayRecurringPaymentProvider;
    constructor(mercadoPagoRecurringPaymentProvider: MercadoPagoRecurringPaymentProvider, stripeRecurringPaymentProvider: StripeRecurringPaymentProvider, payPalRecurringPaymentProvider: PayPalRecurringPaymentProvider, pagSeguroRecurringPaymentProvider: PagSeguroRecurringPaymentProvider, picPayRecurringPaymentProvider: PicPayRecurringPaymentProvider);
    exec(dtoIn: GatewayRecurringPaymentDtoIn): Promise<GatewayRecurringPaymentDtoOut>;
    private buildPendingProviderImplementation;
    private extractGatewayPlanId;
    private sanitizePayload;
    private sanitizeUnknownValue;
    private isSensitiveKey;
    private asObject;
    private toNullableString;
    private normalizeProvider;
}
