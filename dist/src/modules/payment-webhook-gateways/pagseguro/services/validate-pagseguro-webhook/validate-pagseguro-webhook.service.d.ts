import { ValidatePagSeguroWebhookDtoIn } from './dtos/validate-pagseguro-webhook.dto-in';
import { ValidatePagSeguroWebhookDtoOut } from './dtos/validate-pagseguro-webhook.dto-out';
export declare class ValidatePagSeguroWebhookService {
    exec(dtoIn: ValidatePagSeguroWebhookDtoIn): ValidatePagSeguroWebhookDtoOut;
    private safeCompare;
}
