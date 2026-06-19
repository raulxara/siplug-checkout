import { ValidatePicPayWebhookDtoIn } from './dtos/validate-picpay-webhook.dto-in';
import { ValidatePicPayWebhookDtoOut } from './dtos/validate-picpay-webhook.dto-out';
export declare class ValidatePicPayWebhookService {
    exec(dtoIn: ValidatePicPayWebhookDtoIn): ValidatePicPayWebhookDtoOut;
    private normalizeAuthorizationToken;
    private safeCompare;
}
