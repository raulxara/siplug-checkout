import { ValidateStripeWebhookDtoIn } from './dtos/validate-stripe-webhook.dto-in';
import { ValidateStripeWebhookDtoOut } from './dtos/validate-stripe-webhook.dto-out';
export declare class ValidateStripeWebhookService {
    exec(dtoIn: ValidateStripeWebhookDtoIn): ValidateStripeWebhookDtoOut;
    private parseStripeSignature;
    private validateTimestamp;
    private safeCompare;
}
