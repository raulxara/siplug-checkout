import { NormalizePagSeguroWebhookDtoIn } from './dtos/normalize-pagseguro-webhook.dto-in';
import { NormalizePagSeguroWebhookDtoOut } from './dtos/normalize-pagseguro-webhook.dto-out';
export declare class NormalizePagSeguroWebhookService {
    exec(dtoIn: NormalizePagSeguroWebhookDtoIn): NormalizePagSeguroWebhookDtoOut;
    private resolvePrimaryCharge;
    private resolveGatewayTransactionId;
    private resolveEventId;
    private resolveEventType;
    private resolveEventAction;
    private resolveCanonicalStatus;
    private resolveAmount;
    private resolveCurrency;
    private getObjectsArray;
    private getObject;
    private getString;
    private getNumber;
}
