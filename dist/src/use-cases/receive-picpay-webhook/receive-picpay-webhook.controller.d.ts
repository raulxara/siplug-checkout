import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ReceivePicPayWebhookUseCase } from './receive-picpay-webhook.use-case';
export declare class ReceivePicPayWebhookController {
    private readonly receivePicPayWebhookUseCase;
    constructor(receivePicPayWebhookUseCase: ReceivePicPayWebhookUseCase);
    handle(apiCredentialId: string, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>, request: RawBodyRequest<Request>): Promise<{
        status: string;
        message: string;
        data: {
            paymentWebhookEvent: Record<string, unknown>;
            paymentTransaction: Record<string, unknown> | null;
            processingResult: Record<string, unknown>;
            wasAlreadyRegistered: boolean;
        };
    }>;
    private resolveRawBody;
    private resolveHeader;
    private normalizeHeaders;
}
