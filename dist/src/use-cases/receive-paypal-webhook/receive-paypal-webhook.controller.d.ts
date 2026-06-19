import { ReceivePayPalWebhookUseCase } from './receive-paypal-webhook.use-case';
export declare class ReceivePayPalWebhookController {
    private readonly receivePayPalWebhookUseCase;
    constructor(receivePayPalWebhookUseCase: ReceivePayPalWebhookUseCase);
    handle(apiCredentialId: string, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            wasAlreadyRegistered: boolean;
        };
    }>;
    private normalizeHeaders;
}
