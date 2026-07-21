import { NormalizeInfinitePayWebhookDtoIn } from './dtos/normalize-infinitepay-webhook.dto-in';
import { NormalizeInfinitePayWebhookDtoOut } from './dtos/normalize-infinitepay-webhook.dto-out';
export declare class NormalizeInfinitePayWebhookService {
    exec(dtoIn: NormalizeInfinitePayWebhookDtoIn): NormalizeInfinitePayWebhookDtoOut;
    private resolvePayloadRoot;
    private resolveEventId;
    private resolveActionSuffix;
    private resolveCanonicalStatus;
    private resolveAmount;
    private resolveCurrency;
    private getObject;
    private getString;
    private getNumber;
    private getBoolean;
}
