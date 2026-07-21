import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
export declare class StripeGatewayPaymentProvider implements IGatewayPaymentProvider {
    getProviderName(): string;
    supports(gatewayProvider: string): boolean;
    processPayment(dtoIn: GatewayPaymentDtoIn): Promise<GatewayPaymentDtoOut>;
    private processCheckoutSession;
    private buildCheckoutSessionRequestPayload;
    private resolveStripePaymentMethodTypes;
    private buildStripeLineItems;
    private mapSuccessfulCheckoutSessionResponse;
    private mapStripeStatusToInternalStatus;
    private mapStripeStatusToProcessStatus;
    private resolveAccessToken;
    private resolveBaseUrl;
    private resolveIdempotencyKey;
    private extractStripeErrorMessage;
    private formatUnixTimestampToSqlDateTime;
    private asStringArray;
    private asObject;
    private toNullableString;
    private toPositiveInteger;
    private nowAsSqlDateTime;
    private formatDateToSqlDateTime;
    private pad;
    private normalize;
}
