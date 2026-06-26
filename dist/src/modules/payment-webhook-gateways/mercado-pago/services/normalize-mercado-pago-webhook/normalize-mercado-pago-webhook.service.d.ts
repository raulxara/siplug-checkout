import { NormalizeMercadoPagoWebhookDtoIn } from './dtos/normalize-mercado-pago-webhook.dto-in';
import { NormalizeMercadoPagoWebhookDtoOut } from './dtos/normalize-mercado-pago-webhook.dto-out';
export declare class NormalizeMercadoPagoWebhookService {
    exec(dtoIn: NormalizeMercadoPagoWebhookDtoIn): NormalizeMercadoPagoWebhookDtoOut;
    private normalizePayment;
    private resolvePaymentGatewaySubscriptionId;
    private resolvePaymentGatewayInvoiceId;
    private findPointOfInteractionReferenceId;
    private normalizePreapproval;
    private resolvePaymentCanonicalStatus;
    private resolvePreapprovalCanonicalStatus;
    private resolveAmount;
    private resolveCurrency;
    private getObject;
    private getString;
    private getNumber;
}
