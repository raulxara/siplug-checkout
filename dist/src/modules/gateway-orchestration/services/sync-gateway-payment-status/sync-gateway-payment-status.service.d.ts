import { GatewayPaymentStatusDtoIn } from '../../dtos/gateway-payment-status.dto-in';
import { GatewayPaymentStatusDtoOut } from '../../dtos/gateway-payment-status.dto-out';
export declare class SyncGatewayPaymentStatusService {
    exec(dtoIn: GatewayPaymentStatusDtoIn): Promise<GatewayPaymentStatusDtoOut>;
    private syncMercadoPago;
    private syncStripe;
    private syncPayPal;
    private syncPagSeguro;
    private createPayPalAccessToken;
    private buildUnsupportedSyncResponse;
    private buildFailedGatewayResponse;
    private buildSuccessGatewayResponse;
    private mapMercadoPagoStatus;
    private mapStripeStatus;
    private mapPayPalStatus;
    private mapPagSeguroStatus;
    private requireGatewayTransactionId;
    private requireProviderToken;
    private resolveBaseUrl;
    private parseJsonResponse;
    private asObject;
    private toNullableString;
    private nowAsSqlDateTime;
    private normalize;
}
