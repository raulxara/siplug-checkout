import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';
export declare class MercadoPagoRecurringPaymentProvider {
    createSubscription(dtoIn: GatewayRecurringPaymentDtoIn): Promise<GatewayRecurringPaymentDtoOut>;
    private buildHeaders;
    private shouldUseStageScope;
    private buildPreapprovalRequest;
    private resolveGatewayPlanId;
    private shouldAuthorizeCreditCard;
    private resolveStartDate;
    private resolveEndDate;
    private mapFrequencyType;
    private mapGatewayStatus;
    private resolveProviderToken;
    private resolveBaseUrl;
    private resolveBackUrl;
    private centsToAmount;
    private parseJsonResponse;
    private resolveMercadoPagoErrorMessage;
    private sanitizePayload;
    private sanitizeUnknownValue;
    private isSensitiveKey;
    private asObject;
    private toNullableString;
    private toRequiredString;
    private limitText;
    private nowAsIso;
}
