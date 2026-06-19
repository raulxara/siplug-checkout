import { NormalizePicPayWebhookDtoIn } from './dtos/normalize-picpay-webhook.dto-in';
import { NormalizePicPayWebhookDtoOut } from './dtos/normalize-picpay-webhook.dto-out';
export declare class NormalizePicPayWebhookService {
    exec(dtoIn: NormalizePicPayWebhookDtoIn): NormalizePicPayWebhookDtoOut;
    private resolveDataPayload;
    private resolveTransactions;
    private resolvePrimaryTransaction;
    private resolveEventId;
    private resolveEventType;
    private resolveEventAction;
    private resolveCanonicalStatus;
    private getObjectsArray;
    private getObject;
    private getString;
    private getNumber;
}
