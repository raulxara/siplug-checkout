import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ReceivePagSeguroWebhookUseCase } from './receive-pagseguro-webhook.use-case';
export declare class ReceivePagSeguroShortWebhookController {
    private readonly receivePagSeguroWebhookUseCase;
    constructor(receivePagSeguroWebhookUseCase: ReceivePagSeguroWebhookUseCase);
    handle(apiCredentialId: string, body: Record<string, unknown>, headers: Record<string, string | string[] | undefined>, request: RawBodyRequest<Request>): Promise<{
        received: boolean;
        provider: string;
        eventId: string | null;
        processed: boolean;
        wasAlreadyRegistered: boolean;
    }>;
    private resolveRawBody;
    private resolveHeader;
    private normalizeHeaders;
    private extractString;
}
