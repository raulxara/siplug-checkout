import { ReceiveMercadoPagoWebhookUseCase } from './receive-mercado-pago-webhook.use-case';
export declare class ReceiveMercadoPagoWebhookController {
    private readonly receiveMercadoPagoWebhookUseCase;
    constructor(receiveMercadoPagoWebhookUseCase: ReceiveMercadoPagoWebhookUseCase);
    handle(apiCredentialId: string | undefined, body: Record<string, unknown>, queryParams: Record<string, unknown>, headers: Record<string, string | string[] | undefined>): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            wasAlreadyRegistered: boolean;
        };
    }>;
    private resolveApiCredentialId;
    private resolveHeader;
    private normalizeHeaders;
    private resolveDevSkipSignature;
    private extractString;
}
