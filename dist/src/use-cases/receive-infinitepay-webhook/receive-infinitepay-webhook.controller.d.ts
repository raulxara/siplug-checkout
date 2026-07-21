import { ReceiveInfinitePayWebhookUseCase } from './receive-infinitepay-webhook.use-case';
export declare class ReceiveInfinitePayWebhookController {
    private readonly receiveInfinitePayWebhookUseCase;
    constructor(receiveInfinitePayWebhookUseCase: ReceiveInfinitePayWebhookUseCase);
    handle(apiCredentialId: string | undefined, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>): Promise<{
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
