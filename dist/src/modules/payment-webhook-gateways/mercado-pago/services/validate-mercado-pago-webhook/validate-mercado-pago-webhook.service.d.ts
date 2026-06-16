import { ValidateMercadoPagoWebhookDtoIn } from './dtos/validate-mercado-pago-webhook.dto-in';
import { ValidateMercadoPagoWebhookDtoOut } from './dtos/validate-mercado-pago-webhook.dto-out';
export declare class ValidateMercadoPagoWebhookService {
    exec(dtoIn: ValidateMercadoPagoWebhookDtoIn): ValidateMercadoPagoWebhookDtoOut;
    private buildManifest;
    private parseSignature;
    private safeCompare;
}
