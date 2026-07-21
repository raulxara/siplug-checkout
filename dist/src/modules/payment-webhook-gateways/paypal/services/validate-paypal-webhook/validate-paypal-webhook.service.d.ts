import { ValidatePayPalWebhookDtoIn } from './dtos/validate-paypal-webhook.dto-in';
import { ValidatePayPalWebhookDtoOut } from './dtos/validate-paypal-webhook.dto-out';
export declare class ValidatePayPalWebhookService {
    exec(dtoIn: ValidatePayPalWebhookDtoIn): Promise<ValidatePayPalWebhookDtoOut>;
    private getHeader;
    private toNullableString;
}
