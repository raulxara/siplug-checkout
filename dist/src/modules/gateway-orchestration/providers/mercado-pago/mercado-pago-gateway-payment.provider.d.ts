import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
export declare class MercadoPagoGatewayPaymentProvider implements IGatewayPaymentProvider {
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
    private buildPixPaymentRequestPayload;
    private buildPayer;
    private buildAddress;
    private mapSuccessfulPixPaymentResponse;
    private resolveAccessToken;
    private resolveIdempotencyKey;
    private resolveNotificationUrl;
    private resolveDateOfExpiration;
    private mapMercadoPagoStatusToInternalStatus;
    private mapMercadoPagoStatusToProcessStatus;
    private extractMercadoPagoErrorMessage;
    private convertCentsToAmount;
    private asObject;
    private toNullableString;
    private formatExternalDate;
    private nowAsSqlDateTime;
    private formatDateToSqlDateTime;
    private pad;
    private normalize;
}
