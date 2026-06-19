import { NormalizePayPalWebhookDtoIn } from './dtos/normalize-paypal-webhook.dto-in';
import { NormalizePayPalWebhookDtoOut } from './dtos/normalize-paypal-webhook.dto-out';
export declare class NormalizePayPalWebhookService {
    exec(dtoIn: NormalizePayPalWebhookDtoIn): NormalizePayPalWebhookDtoOut;
    private resolveCanonicalStatus;
    private resolveGatewayTransactionId;
    private resolveGatewayChargeId;
    private resolveGatewaySubscriptionId;
    private resolvePaymentTransactionId;
    private resolveAmount;
    private resolveCurrency;
    private getObject;
    private getString;
}
