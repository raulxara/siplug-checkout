import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
export declare class PayPalGatewayPaymentProvider implements IGatewayPaymentProvider {
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
    private createAccessToken;
    private buildOrderRequestPayload;
    private buildItems;
    private resolveClientId;
    private resolveClientSecret;
    private resolveBaseUrl;
    private resolveIdempotencyKey;
    private extractApprovalUrl;
    private extractPayPalErrorMessage;
    private mapPayPalStatusToInternalStatus;
    private mapPayPalStatusToProcessStatus;
    private formatAmountFromCents;
    private asObject;
    private toNullableString;
    private toPositiveInteger;
    private nowAsSqlDateTime;
    private formatDateToSqlDateTime;
    private pad;
    private normalize;
}
