import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';
import { MercadoPagoRecurringPaymentProvider } from '../../providers/mercado-pago/mercado-pago-recurring-payment.provider';
export declare class DispatchGatewayRecurringPaymentService {
    private readonly mercadoPagoRecurringPaymentProvider;
    constructor(mercadoPagoRecurringPaymentProvider: MercadoPagoRecurringPaymentProvider);
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
