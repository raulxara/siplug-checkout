import { GatewayPaymentDtoIn } from '../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../dtos/gateway-payment.dto-out';
export interface IGatewayPaymentProvider {
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
}
