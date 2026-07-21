import { NormalizeStripeWebhookDtoIn } from './dtos/normalize-stripe-webhook.dto-in';
import { NormalizeStripeWebhookDtoOut } from './dtos/normalize-stripe-webhook.dto-out';
export declare class NormalizeStripeWebhookService {
    exec(dtoIn: NormalizeStripeWebhookDtoIn): NormalizeStripeWebhookDtoOut;
    private resolveCanonicalStatus;
    private resolveGatewayTransactionId;
    private resolveGatewayPaymentIntentId;
    private resolveGatewayChargeId;
    private resolveGatewaySubscriptionId;
    private resolveGatewayInvoiceId;
    private resolveAmount;
    private resolveCurrency;
    private getObject;
    private getString;
    private getNumber;
}
