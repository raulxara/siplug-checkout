import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
export declare abstract class UnsupportedGatewayPaymentProvider implements IGatewayPaymentProvider {
    private readonly providerName;
    private readonly aliases;
    protected constructor(providerName: string, aliases: string[]);
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
    private normalize;
}
