import { NormalizePagSeguroWebhookDtoIn } from './dtos/normalize-pagseguro-webhook.dto-in';
import { NormalizePagSeguroWebhookDtoOut } from './dtos/normalize-pagseguro-webhook.dto-out';
export declare class NormalizePagSeguroWebhookService {
    exec(dtoIn: NormalizePagSeguroWebhookDtoIn): NormalizePagSeguroWebhookDtoOut;
    private normalizeOrderOrChargeEvent;
    private normalizeSubscriptionEvent;
    private isSubscriptionPayload;
    private resolveGatewaySubscriptionId;
    private resolvePrimaryCharge;
    private resolveGatewayTransactionId;
    private resolveEventId;
    private resolveSubscriptionEventId;
    private resolveEventType;
    private resolveEventAction;
    private resolvePaymentCanonicalStatus;
    private resolveSubscriptionCanonicalStatus;
    private resolveAmount;
    private resolveCurrency;
    private getObjectsArray;
    private getObject;
    private getString;
    private getNumber;
    private normalize;
}
