import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';
export declare class StripeRecurringPaymentProvider {
    createSubscription(dtoIn: GatewayRecurringPaymentDtoIn): Promise<GatewayRecurringPaymentDtoOut>;
    private buildCheckoutSessionRequest;
    private resolveStripePaymentMethodType;
    private buildHeaders;
    private resolveStripePriceId;
    private mapStripeInterval;
    private mapStripeCheckoutStatus;
    private resolveProviderToken;
    private resolveBaseUrl;
    private normalizeStripeBaseUrl;
    private resolveSuccessUrl;
    private resolveCancelUrl;
    private ensureStripeSessionPlaceholder;
    private parseJsonResponse;
    private resolveStripeErrorMessage;
    private urlSearchParamsToObject;
    private sanitizePayload;
    private sanitizeUnknownValue;
    private isSensitiveKey;
    private asObject;
    private toNullableString;
    private limitText;
}
