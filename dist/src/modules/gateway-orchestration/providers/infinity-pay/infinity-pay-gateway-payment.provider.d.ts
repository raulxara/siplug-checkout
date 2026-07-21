import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
export declare class InfinityPayGatewayPaymentProvider implements IGatewayPaymentProvider {
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
    private buildPaymentLinkRequestPayload;
    private buildItems;
    private buildCustomer;
    private buildAddress;
    private extractCheckoutUrl;
    private extractInfinitePayErrorMessage;
    private asObject;
    private toNullableString;
    private toPositiveInteger;
    private nowAsSqlDateTime;
    private formatDateToSqlDateTime;
    private pad;
    private normalize;
}
